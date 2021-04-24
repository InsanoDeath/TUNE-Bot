const { canModifyQueue } = require("../../util/indusic")
const config = require("../../config.json")

module.exports = {
  name: "resume",
  aliases: ["res"],
  description: "Resumes a music",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!client.distube.isPaused(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> The song is not paused")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot Resume the music")
      return message.reply(embed)
    }

    client.distube.resume(message)
    embed.setColor(config.Colors.green)
    embed.setDescription("<:tune_yes:834812030711103528> Music resumed")
    message.channel.send(embed)
  }
}