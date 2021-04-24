const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "jump",
  aliases: ["skipto"],
  usage: "[number]",
  description: "Jumps to a specific song",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    let queue = client.distube.getQueue(message)
    if(!queue) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    if(!canModifyQueue(message.member)) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> You cannot use this command at the moment")
      return message.reply(embed)
    }
    
    if(!args.length) {
      embed.setColor(config.Colors.red)
      embed.setTitle("<:tune_no:834812030334140446> Please mention the song number")
      return message.reply(embed)
    }

    if(isNaN(args[0])) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please type a Song Number")
      return message.reply(embed)
    }

    if(0 <= args[0] < queue.songs.length)
    embed.setColor(config.Colors.green)
    client.distube.jump(message, parseInt(args[0]))
    embed.setDescription(`<:tune_yes:834812030711103528> Jumped ${parseInt(args[0])} songs!`)
    message.channel.send(embed)
  }
}