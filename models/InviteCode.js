const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const InviteCodeSchema = new Schema({
  inviteCode: String,
});

module.exports = InviteCode = mongoose.model("InviteCode", InviteCodeSchema);
