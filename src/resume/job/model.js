const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const jobSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    company: {
      type: String,
    },
    post: {
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

jobSchema.plugin(mongoosePaginate);
jobSchema.plugin(idPlugin);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
