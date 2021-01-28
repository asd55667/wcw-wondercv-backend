const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const jobSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    jobs: [
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

jobSchema.pre("validate", function (next) {
  if (this.jobs.length > 30) {
    throw "jobs exceeds maximum array size (30)!";
  }
  next();
});

jobSchema.plugin(mongoosePaginate);
jobSchema.plugin(idPlugin);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
