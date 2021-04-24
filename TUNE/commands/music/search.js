const config = require("../../config.json")

module.exports = {
  name: "search",
  usage: "Song name",
  description: "Search songs for you",
  async execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    if(!args.length) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Please provide a string to search")
      return message.reply(embed)
    }

    const search = await client.distube.search(args.join(" "))
    if(!search) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> Could not get the search result")
      return message.reply(embed)
    }

    embed.setColor(config.Colors.green)
    embed.setTitle(`<:tune_yes:834812030711103528> Search Results for ${args.join(" ")}`)
    for(var i = 0; i < search.length; i++) {
      embed.addField(`\u200b`, `${i + 1}) **__[${search[i].name}](${search[i].url})__**`)
    }
    message.channel.send(embed)
  }
}