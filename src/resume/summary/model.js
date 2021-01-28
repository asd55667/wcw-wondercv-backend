const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const summarySchema = mongoose.Schema({
  _id: {
    type: String,
  },
  summarys: [
    {
      ref: Boolean,
      desc: String,
      update: Date,
    },
  ],
});

summarySchema.pre("validate", function (next) {
  if (this.summarys.length > 30) {
    throw "summary exceeds maximum array size (30)!";
  }
  next();
});

summarySchema.plugin(mongoosePaginate);
summarySchema.plugin(idPlugin);

const Summary = mongoose.model("Summary", summarySchema);

module.exports = Summary;
