const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { DateTime } = require("luxon");



const YellowCardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start_time: { type: String, required: true, maxLength: 100 },
    end_time: { type: String, required: true, maxLength: 100 },
});

// Virtual for author's URL
YellowCardSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/yellowcard/${this._id}`;
});

// Export model
module.exports = mongoose.model("YellowCard", YellowCardSchema);
