const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "filter",
  aliases: ["f"],
  usage: "Filter name",
  description: "Filters the playing song",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    const filters = [
      `3d`, //3d
      `bassboost`, //bassboost
      `echo`, //echo
      `karaoke`, //karaoke
      `nightcore`, //nightcore
      `vaporwave`, //vaporwave
      "clear", //clear
      "earrape",
      "heavybass"
    ]

    if(!config.premium.includes(message.guild.id)) {
      embed.setColor(config.Colors.Bot)
      embed.setDescription("<:tune_no:834812030334140446> Purchase premium for the server to be able to use this command in this server")
      return message.reply(embed)
    }

    if(!args.length) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please mention a filter")
      return message.reply(embed)
    }

    if(!client.distube.getQueue(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot modify the song")
      return message.reply(embed)
    }

    if(!filters.includes(args[0].toLowerCase())) {
      embed.setColor(config.Colors.Bot)
      embed.setDescription("You can use the following Filters")
      for(var i = 0; i < filters.length; i++) {
        embed.addField("\u200b", `\`${filters[i]}\``, true)
      }
      return message.reply(embed)
    }

    let filter = args[0].toLowerCase()

    client.distube.setFilter(message, filter)
    embed.setColor(config.Colors.green)
    embed.setDescription("<:tune_yes:834812030711103528> Song filtered")
    message.channel.send(embed)
  }
}