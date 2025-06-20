const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Usuario",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,// this is the expiry time in seconds
  },
});
module.exports = mongoose.model("Token", TokenSchema)