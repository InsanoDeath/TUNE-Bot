const config = require("../../config.json")
const { canModifyQueue } = require("../../util/indusic")
const createBar = require("string-progressbar")

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: "tells about the current song",
  execute(message, args, client, Discord) {
    let embed = new Discord.MessageEmbed()

    const queue = client.distube.getQueue(message)

    if(!queue) {
      embed.setColor(config.Colors.red)
      embed.setDescription("<:tune_no:834812030334140446> No song is played in the server")
      return message.reply(embed)
    }

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new Discord.MessageEmbed()
      .setTitle("<:tune_yes:834812030711103528> Now playing")
      .setDescription(`${song.name}\n${song.url}`)
      .setColor(config.Colors.Bot)
      .setAuthor(message.client.user.username);

    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    }

    return message.channel.send(nowPlaying);
  }
}