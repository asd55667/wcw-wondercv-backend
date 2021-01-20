const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const customSchema = new mongoose.Schema(
  {
    experience: {
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

customSchema.plugin(mongoosePaginate);
customSchema.plugin(idPlugin);

const Custom = mongoose.model("Custom", customSchema);

module.exports = Custom;
