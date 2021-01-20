const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
