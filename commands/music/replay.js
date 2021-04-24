const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "replay",
  aliases: ["rp"],
  description: "replays the current song",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!config.premium.includes(message.guild.id)) {
      embed.setColor(config.Colors.Bot)
      embed.setDescription("<:tune_no:834812030334140446> Purchase the premium to unlock this feature")
      return message.reply(embed)
    }

    const queue = client.distube.getQueue(message)

    if(!queue) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot modify the song")
      return message.reply(embed)
    }

    const song = queue.songs[0]

    client.distube.playSkip(message, song.url)
    embed.setColor(config.Colors.green)
    embed.setDescription("<:tune_yes:834812030711103528> Song Replayed")
    message.channel.send(embed)
  }
}