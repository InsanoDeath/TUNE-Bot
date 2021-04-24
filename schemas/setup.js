const mongoose = require("mongoose")

const setupSchema = new mongoose.Schema({
  _id: { type: String },
  prefix: { type: String },
  premium: { type: String, default: 0}
})

module.exports = mongoose.model("setup", setupSchema)