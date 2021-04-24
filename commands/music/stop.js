const { canModifyQueue } = require("../../util/indusic")
const config = require("../../config.json")

module.exports = {
  name: "stop",
  aliases: "st",
  description: "stops the playing music",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()
    .setColor(config.Colors.Bot)

    if(!client.distube.getQueue(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setTitle("<:tune_no:834812030334140446> You cannot Stop the songs")
      message.reply(embed)
    }

    client.distube.stop(message)
    embed.setDescription("<:tune_yes:834812030711103528> Music Stopped")
    message.channel.send(embed)
  }
}