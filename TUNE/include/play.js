const config = require("../config.json")

module.exports = {
  async play(song, message, client, Discord, message1) {

    client.distube.on("initQueue", queue => {
      queue.autoplay = false;
      queue.volume = 100;
    });

    client.distube.play(message, song.title).then(async () => {
      message1.delete()
    })
  }
}