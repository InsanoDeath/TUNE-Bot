const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "shuffle",
  aliases: ["shuff"],
  description: "shuffle the queue",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!client.distube.getQueue(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot modify the queue")
      return message.reply(embed)
    }

    client.distube.shuffle(message)
    embed.setColor(config.Colors.green)
    embed.setDescription(`<:tune_yes:834812030711103528> Queue shuffled`)
    message.channel.send(embed)
  }
}