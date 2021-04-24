const config = require("../../config.json")

module.exports = {
  name: "invite",
  description: "To add/invite the bot to your server",
  execute(message, args, client, Discord) {
    var permissions = 8;

    let invite = new Discord.MessageEmbed()
      .setTitle(`**Invite me to listen Premium Songs**`)
      .setDescription(
        `**Invite me today!** \n\n [Invite Link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot)`
      )
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`
      )
      .setColor(config.Colors.Bot);
    return message.channel.send(invite);
  }
};
