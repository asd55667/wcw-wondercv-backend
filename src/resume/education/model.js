const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const educationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    school: {
      type: String,
    },
    major: {
      type: String,
    },
    scholar: {
      degree: {
        type: String,
      },
      type: {
        type: String,
      },
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

educationSchema.plugin(mongoosePaginate);
educationSchema.plugin(idPlugin);

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
