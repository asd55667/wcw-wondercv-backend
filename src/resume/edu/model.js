const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const educationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    data: [
      {
        ref: Boolean,
        name: {
          desc: {
            type: String,
            default: "学校名称",
          },
          value: {
            type: String,
            default: "",
          },
        },
        timespan: {
          start: {
            type: String,
          },
          end: {
            type: String,
          },
        },
        attrs: {
          post: { desc: { type: String, default: "所学专业" }, value: String },
          scholar: { desc: { type: String, default: "学历" }, value: String },
          department: {
            desc: { type: String, default: "所在学院" },
            value: String,
          },
        },
        location: {
          desc: { type: String, default: "所在城市" },
          value: String,
        },
        desc: String,
        update: Date,
      },
    ],
  },

  { autoCreate: true }
);

educationSchema.pre("validate", function (next) {
  if (this.data.length > 30) {
    throw "edus exceeds maximum array size (30)!";
  }
  next();
});

educationSchema.plugin(mongoosePaginate);
educationSchema.plugin(idPlugin);

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
