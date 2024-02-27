const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { DateTime } = require("luxon");



const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
});

// Virtual for author's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
