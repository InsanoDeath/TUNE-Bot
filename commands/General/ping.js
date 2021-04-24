module.exports = {
  name: "ping",
  cooldown: 10,
  description: "Show the bot's average ping",
  async execute(message, client, Discord) {
    let msg = await message.channel.send("Pinging...")

    let latency = msg.createdTimestamp - message.createdTimestamp
    // message.reply(`📈 Average ping to API: ${Math.round(message.client.ws.ping)} ms`)
    msg.edit(`latency: ${latency}ms\nAPI Ping: ${Math.round(message.client.ws.ping)}ms`)
  }
};
