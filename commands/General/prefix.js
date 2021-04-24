const config = require("../../config.json")

module.exports = {
    name: "prefix",
    aliases: ["pfx"],
    description: "send the prefix of the guild",
    execute(message, args, client, Discord, db) {
        let prefix = config.PREFIX

            if(!args.length) {
                message.channel.send(`The command prefix of the guild is \`${prefix}\`. To set a prefix for the guild, use \`${prefix}setprefix or @ROW-BOT#0930 setprefix\``)
            }

            if(args.length) return
    }
}