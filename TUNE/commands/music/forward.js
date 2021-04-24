const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")

module.exports = {
  name: "forward",
  aliases: ["fwd"],
  usage: "[Number in seconds]",
  description: "Seeks a song forward",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!config.premium.includes(message.guild.id)) {
      embed.setColor(config.Colors.Bot)
      embed.setDescription("<:tune_no:834812030334140446> Purchase the premium to unlock this feature")
      return message.reply(embed)
    }

    if(!args.length) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please mention a number")
      return message.reply(embed)
    }
    
    if(isNaN(args[0])) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please mention a number")
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

    let seektime = queue.currentTime + Number(args[0])*1000;
    if (seektime >= queue.songs[0].duration * 1000) { seektime = queue.songs[0].duration * 1000 - 1; }
    client.distube.seek(message, Number(seektime));
    embed.setColor(config.Colors.green)
    embed.setDescription(`<:tune_yes:834812030711103528> Song seeked forward by ${args[0]} seconds`)
    message.channel.send(embed)
  }
}