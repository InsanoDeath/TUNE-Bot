const { canModifyQueue } = require("../../util/indusic")
const config = require("../../config.json")
const ytdl = require("ytdl-core");
const ytsr = require("youtube-sr").default
const https = require("https");
const { play } = require("../../include/play")

module.exports = {
  name: "play",
  aliases: ["p"],
  usage: "Song name or link",
  description: "Plays song",
  async execute(message, args, client, Discord) {
    const { channel } = message.member.voice

    let embed = new Discord.MessageEmbed()
    .setColor(config.Colors.Bot)

    if(!channel) {
      embed.setDescription("<:tune_no:834812030334140446> You need to be in a voice channel to play a music")
      return message.reply(embed)
    }

    if(client.distube.isPlaying(message) && channel !== message.guild.me.voice.channel) {
      embed.setDescription(`<:tune_no:834812030334140446> You must be in same channel as ${client.user.username}`)
      return message.reply(embed)
    }

    if(!args.length) {
      embed.setDescription("<:tune_no:834812030334140446> Please mention the song you want me to play")
      return message.reply(embed)
    }

    const permissions = channel.permissionsFor(client.user)
    if(!permissions.has("CONNECT")) {
      embed.setDescription("<:tune_no:834812030334140446> I cannot connect to that Voice channel")
      return message.reply(embed)
    }
    if(!permissions.has("SPEAK")) {
      embed.setDescription("<:tune_no:834812030334140446> Cannot speak in that voice channel")
      return message.reply(embed)
    }

    const search = args.join(" ")
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided 
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            return message.reply("<:tune_no:834812030334140446> No content could be found at that url.").catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.reply("<:tune_no:834812030334140446> Following url redirection...").catch(console.error);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      filters: [],
      realseek: 0,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          thumbnail: songInfo.videoDetails.thumbnails[3],
          name: songInfo.videoDetails.author.name
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        songInfo = await ytsr.searchOne(search)
        song = {
          title: songInfo.title,
          url: "https://www.youtube.com/watch?v=" + songInfo.id,
          duration: Math.floor(songInfo.duration / 1000),
          thumbnail: songInfo.thumbnail,
          name: songInfo.channel.name
      }
      } catch(error) {
        console.error(error);
        embed.setDescription(error.message)
        return message.reply(embed).catch(console.error);
      }
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    embed.setColor(config.Colors.yellow)
    embed.setAuthor("Please Wait...", "https://cdn.discordapp.com/emojis/769935094285860894.gif")

    const message1 = await message.channel.send(embed)

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message, client, Discord, message1);
    }catch(errpr) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      embed.setDescription(`Could not join the channel: ${error}`)
      return message.channel.send(embed).catch(console.error);
    }
  }
}