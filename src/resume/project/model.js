const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const projectSchema = new mongoose.Schema(
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
            default: "项目名称",
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
          post: { desc: { type: String, default: "担任角色" }, value: String },
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

projectSchema.pre("validate", function (next) {
  if (this.datas.length > 30) {
    throw "projects exceeds maximum array size (30)!";
  }
  next();
});

projectSchema.plugin(mongoosePaginate);
projectSchema.plugin(idPlugin);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
