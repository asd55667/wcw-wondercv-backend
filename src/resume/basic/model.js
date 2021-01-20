const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const basicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    telephone: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    workIntension: {
      type: String,
      default: null,
    },
    wechat: {
      type: String,
      default: null,
    },
    linkin: {
      type: String,
      default: null,
    },
    age: {
      type: String,
      default: null,
    },
    sex: {
      type: String,
      default: null,
    },
    height: {
      type: String,
      default: null,
    },
    weight: {
      type: String,
      default: null,
    },
    race: {
      type: String,
      default: null,
    },
    Hometown: {
      type: String,
      default: null,
    },
    politicalStatus: {
      type: String,
      default: null,
    },
    marritalState: {
      type: String,
      default: null,
    },
    currentJob: {
      type: String,
      default: null,
    },
    expectSalary: {
      type: String,
      default: null,
    },
  },
  { autoCreate: true }
);

basicSchema.plugin(mongoosePaginate);
basicSchema.plugin(idPlugin);

const Basic = mongoose.model("Basic", basicSchema);

module.exports = Basic;
