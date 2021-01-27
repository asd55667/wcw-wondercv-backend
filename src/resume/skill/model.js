const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const skillSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  skill: [
    {
      ref: Boolean,
      desc: String,
      update: Date,
    },
  ],
});

skillSchema.pre("validate", function (next) {
  if (this.skill.length > 30) {
    throw "skill exceeds maximum array size (30)!";
  }
  next();
});

skillSchema.plugin(mongoosePaginate);
skillSchema.plugin(idPlugin);

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
