const { version } = require("discord.js");
const moment = require("moment");
let os = require('os')
let cpuStat = require("cpu-stat")
let pkg = require("../../package.json")
let config = require("../../config.json")


module.exports = {
  name: "info",
  description: "Sends detailed info about the client",
  async execute(message, args, client, Discord, db) {

    cpuStat.usagePercent(function (err, percent, seconds) {
      if (err) {
        return console.log(err);
      }
      
      let sec = Math.floor(message.client.uptime / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      sec %= 60;
      minutes %= 60;
      hours %= 24;

      const duration = `${days} day(s),${hours} hours, ${minutes} minutes, ${sec} seconds`

      let connectedchannelsamount = 0;
      let guilds = client.guilds.cache.map((guild) => guild);
      for (let i = 0; i < guilds.length; i++) {
        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
      }
      if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;


      const botinfo = new Discord.MessageEmbed()
        .setAuthor(client.user.username)
        .setTitle("__**Stats:**__")
        .setColor(config.Colors.Bot)
        .addField("🤖Bot Tag", client.user.tag, true)
        .addField("💡ROW-Version", `v${pkg.version}`, true)
        .addField("👾 Discord.js", `v${version}`, true)
        .addField("🖲️ Node", `${process.version}`, true)
        .addField("🧮 Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
        .addField("⌚️ Uptime ", `${duration}`, true)
        .addField("📶 Ping", ` ${Math.round(message.client.ws.ping)}ms`, true)
        .addField("👤 Users", `${client.users.cache.size}`, true)
        .addField("🌐 Servers", `${client.guilds.cache.size}`, true)
        .addField("📁 Channels ", `${client.channels.cache.size}`, true)
        .addField("📁 Connected Channels", `\`${connectedchannelsamount}\``, true)
        .addField("🖥️ CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
        .addField("🎚️ CPU usage", `\`${percent.toFixed(2)}%\``, true)
        .addField("📡 Arch", `\`${os.arch()}\``, true)
        .addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
        .addField("\u200b", "\u200b", false)
        .addField("Bot By:", `>>> <@${config.BOT_OWNER}> \`InsanoDeath#1972\``, false)
        .setFooter(config.FooterText, config.FooterImage)

      message.channel.send(botinfo)
    });
  }
};