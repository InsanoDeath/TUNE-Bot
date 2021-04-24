const fs = require("fs")
const config = require("../config.json")
const setup = require("../schemas/setup")

module.exports = (client, Discord) => {
  client.commands = new Discord.Collection()
  client.cooldowns = new Discord.Collection()

  let commandFolders = fs.readdirSync("./commands")
  for (let folder of commandFolders) {
    let commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))
    for (let file of commandFiles) {
      let command = require(`../commands/${folder}/${file}`)

      client.commands.set(command.name, command)
    }
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  client.on("message", async message => {
    if(message.author.bot || !message.guild) return
    let PREFIX = config.PREFIX

    // const result = await setup.findOne({ _id: message.guild.id })
    // if(!result) PREFIX = config.PREFIX
    // if(result) PREFIX = result.prefix

    let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    if (!message.content.startsWith(matchedPrefix)) return;

    if (message.content.startsWith(matchedPrefix)) {
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    let reply = "There was an error executing this command";

    try {
      command.execute(message, args, client, Discord);
    } catch (error) {
      console.error(error);
      message.reply(reply);
      message.delete();
      }
    }
  })
}