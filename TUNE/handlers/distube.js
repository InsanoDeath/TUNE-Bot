const config = require("../config.json")
const { canModifyQueue } = require("../util/indusic")

module.exports = (client, Discord) => {
    let embed = new Discord.MessageEmbed()

    let collector;

    ////////////PLAYING SONG
    client.distube.on("playSong", async (message, queue, song) => {
      if(collector && !collector.ended) collector.stop()

      const songEmbed = new Discord.MessageEmbed()
      .setColor(config.Colors.Bot)
      .setTitle("<:Music:834765975176871987> Playing Song")
      .setDescription(`**Song: [${song.name}](${song.url})**`)
      .addField("Requested By:", `>>> ${song.user}`, true)
      .addField("⏱ Duration:", `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
      .addField("🌀 Queue:", `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
      .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
      .addField("♾ Loop:", `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? "<:tune_yes:834812030711103528> Queue" : "<:tune_yes:834812030711103528> Song" : "<:tune_no:834812030334140446>"}`, true)
      .addField("↪️ Autoplay:", `>>> ${queue.autoplay ? "<:tune_yes:834812030711103528>" : "<:tune_no:834812030334140446>"}`, true)
      .addField("❔ Filter:", `>>> ${queue.filter || "<:tune_no:834812030334140446>"}`, true)
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setAuthor(message.author.tag , message.member.user.displayAvatarURL({ dynamic: true }), config.discord)
      .setImage(song.thumbnail)

      const playingMessage = await message.channel.send(songEmbed)

      try {
        await playingMessage.react("<:tune_play_pause:834765975270326343>") //PLAY-PAUSE
        await playingMessage.react("<:tune_stop:834765975340449802>") //STOP
        await playingMessage.react("<:tune_skip:834765975495639050>") //SKIP
        await playingMessage.react("<:tune_loop:834765975123001405>") //LOOP
        await playingMessage.react("<:tune_shuffle:834765975164289066>") //SHUFFLE
        // await playingMessage.react("<:tune_mute:834765975063625749>") // mute
        await playingMessage.react("<:tune_decrease:834765975475060767>") //DECREASE
        await playingMessage.react("<:tune_increase:834765975223009320>") //INCREASE
      } catch(error) {
        embed.setColor(config.Colors.red)
        embed.setDescription(`Error: ${error}`)
        return message.channel.send(embed)
      }

      const filter = (reaction, user) => user.id !== message.client.user.id

      collector = await playingMessage.createReactionCollector(filter, {
        time: song.duration > 0 ? song.duration * 1000 : 600000
      })

      collector.on("collect", async (reaction, user) => {
        if(!queue) return

        const member = reaction.message.guild.member(user)
        reaction.users.remove(user)

        if(!canModifyQueue(member)) {
          embed.setColor(config.Colors.red)
          embed.setDescription("You cannot modify the songs")
          return message.channel.send(`${member}, embed`)
        }

        switch (reaction.emoji.id) {
          case "834765975270326343":
          if(client.distube.isPlaying(message)) {
            embed.setColor(config.Colors.red)
            embed.setDescription("**Song Paused**")
            client.distube.pause(message)
            return message.channel.send(embed)
          } else if(client.distube.isPaused(message)) {
            embed.setColor(config.Colors.green)
            embed.setDescription("**Song resumed**")
            client.distube.resume(message)
            message.channel.send(embed)
          }
          break;

          case "834765975340449802":
          embed.setColor(config.Colors.red)
          embed.setDescription("Song Stopped!!")
          client.distube.stop(message)
          if(collector && !collector.ended) collector.stop()
          message.channel.send(embed)
          break;

          case "834765975495639050":
          embed.setColor(config.Colors.green)
          embed.setDescription("**Song Skipped**")
          client.distube.skip(message)
          message.channel.send(embed)
          break;

          case "834765975123001405":
          embed.setColor(config.Colors.green)
          let mode = client.distube.setRepeatMode(message)
          mode = mode ? mode == 2 ? "Repeating **QUEUE** is now \`enabled\`" : "Repeating **SONG** is now \`enabled\`" : "Repeating is set to **Off**";
          embed.setDescription(mode)
          message.channel.send(embed)
          break;

          case "834765975164289066":
          embed.setColor(config.Colors.green)
          embed.setDescription("**Songs Shuffled**")
          client.distube.shuffle(message)
          message.chanel.send(embed)
          break;

          case "834765975475060767":
          if(!config.premium.includes(message.guild.id)) {
            embed.setColor(config.Colors.red)
            embed.setDescription("Purchase Premium to unlick the feature for this Guid")
            return message.channel.send(embed)
          }
          if(queue.volume < 11) return
          embed.setColor(config.Colors.yellow)
          client.distube.setVolume(message, Number(queue.volume) - 10)
          embed.setDescription(`Song Volume Decreased to ${queue.volume}`)
          message.channel.send(embed)
          break;

          case "834765975223009320":
          if(!config.premium.includes(message.guild.id)) {
            embed.setColor(config.Colors.red)
            embed.setDescription("Purchase Premium to unlick the feature for this Guid")
            return message.channel.send(embed)
          }
          if(queue.volume > 90) return
          embed.setColor(config.Colors.yellow)
          client.distube.setVolume(message, Number(queue.volume) + 10)
          embed.setDescription(`Song Volume Increased to ${queue.volume}`)
          message.channel.send(embed)
          break;
        }
      })

      collector.on("end", () => {
        try {
          playingMessage.reactions.removeAll().then(() => {
            playingMessage.delete()
          })
        } catch(error) {
          console.log(error)
        }
      })
    })

    /////////ADDING SONG
    client.distube.on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))

    ///////////FINISHED
    client.distube.on("finish", (message) => {
      if(collector && !collector.ended) collector.stop()
      embed.setColor(config.Colors.red)
      embed.setDescription("The Queue is Ended")
      return message.channel.send(embed)
    })
}