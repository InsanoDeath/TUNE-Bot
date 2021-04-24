const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "skips the current song",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!client.distube.getQueue(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot skip the song")
      return message.reply(embed)
    }

    client.distube.skip(message)
    embed.setColor(config.Colors.green)
    embed.setDescription(`<:tune_yes:834812030711103528> Song skipped`)
    message.channel.send(embed)
  }
}