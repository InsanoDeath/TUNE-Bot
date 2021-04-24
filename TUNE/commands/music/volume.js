const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "volume",
  aliases: ["v"],
  usage: "[Number]",
  description: "changes volume of a song",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!config.premium.includes(message.guild.id)) {
      embed.setColor(config.Colors.Bot)
      embed.setDescription("<:tune_no:834812030334140446> Purchase the premium to unlock this feature")
      return message.reply(embed)
    }

    if(!args.length) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please mention a number between 1-100")
      return message.reply(embed)
    }

    if(!client.distube.getQueue(message)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }
    
    if(isNaN(args[0])) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please mention a number between 1-100")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot modify the song")
      return message.reply(embed)
    }

    if(args[0] > 100 || args[0] <= 0) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please mention a number between 1-100")
      return message.reply
    }

    client.distube.setVolume(message, args[0])
    embed.setColor(config.Colors.green)
    embed.setDescription(`<:tune_yes:834812030711103528> Song Volume Changed to ${args[0]}`)
    message.channel.send(embed)
  }
}