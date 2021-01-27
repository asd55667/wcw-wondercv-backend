const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const projectSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
    },
    department: {
      type: String,
    },
    city: {
      type: String,
    },
    timespan: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    desc: { type: String },
  },

  { autoCreate: true }
);

projectSchema.plugin(mongoosePaginate);
projectSchema.plugin(idPlugin);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
