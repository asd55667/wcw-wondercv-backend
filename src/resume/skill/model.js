const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const skillSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  data: [
    {
      ref: Boolean,
      desc: {
        type: String,
        default:
          " 技术能力在技术型简历中非常重要，有条理地罗列技能项，可以让 HR 快速知道求职者的优势和能力范围 ",
      },
      update: Date,
    },
  ],
});

skillSchema.pre("validate", function (next) {
  if (this.data.length > 30) {
    throw "skill exceeds maximum array size (30)!";
  }
  next();
});

skillSchema.plugin(mongoosePaginate);
skillSchema.plugin(idPlugin);

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
