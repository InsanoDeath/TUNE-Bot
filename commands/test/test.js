module.exports = {
  name: "test",
  execute(message, args, client, Discord) {
    let reply = client.distube.getQueue(message)
    console.log(reply)
  }
}