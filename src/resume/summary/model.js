const mongoose = require("mongoose");

const summarySchema = mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
});

const Summary = mongoose.model("Summary", summarySchema);

module.exports = Summary;
