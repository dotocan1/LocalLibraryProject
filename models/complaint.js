const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { DateTime } = require("luxon");



const ComplaintSchema = new Schema({
  description: { type: String, required: true, maxLength: 100 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for author's URL
ComplaintSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/complaint/${this._id}`;
});

// Export model
module.exports = mongoose.model("Complaint", ComplaintSchema);
