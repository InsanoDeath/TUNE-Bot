const Discord = require("discord.js")
const client = new Discord.Client({
  restTimeOffset: 0
})
const fs = require("fs")

client.queue = new Map();

const config = require("./config.json")

const DisTube = require("distube")
client.distube = new DisTube(client, {
    searchSongs: false,
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    customFilters: config.filters
})

//////MONGOOSE
// const mongoose = require("mongoose")
// mongoose.connect(process.env.mongodb, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// }).then(() => {
//   console.log("MongoDB Connected")
// }).catch(err => console.log(err))

const handlers = fs.readdirSync("./handlers").filter(h => h.endsWith(".js"))
for(let handler of handlers) {
  require(`./handlers/${handler}`)(client, Discord)
}


client.on("ready", () => {
  console.log("TUNE is ready to play Music!!")
  const guild = client.guilds.cache.size
  client.user.setActivity(`TUNES`, { type: "LISTENING" })
})

client.login(process.env.TOKEN)