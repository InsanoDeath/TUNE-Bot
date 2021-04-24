const { canModifyQueue } = require("../../util/indusic")
const config = require("../../config.json")

module.exports = {
  name: "pause",
  description: "Pause the playing music",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!client.distube.isPlaying(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is currently playing in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot Pause the song")
      return message.reply(embed)
    }

    client.distube.pause(message)
    embed.setColor(config.Colors.green)
    embed.setDescription("<:tune_yes:834812030711103528> Song Paused")
    message.channel.send(embed)
  }
}