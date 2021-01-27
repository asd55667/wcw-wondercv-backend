const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const value = new mongoose.Schema({
  value: { type: String, default: null },
  desc: String,
});

const basicSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user: {
      name: {
        desc: String,
        value: {
          type: String,
          default: null,
        },
      },
      avatar: { desc: String, src: String },
    },
    contact: {
      telephone: {
        value: { type: Number, default: null },
        desc: String,
      },
      email: { value: { type: String, default: null }, desc: String },
      city: { value: { type: String, default: null }, desc: String },
    },
    social: {
      website: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },

      wechat: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      linkin: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
    },
    intension: {
      workIntension: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      currentJob: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      expectSalary: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
    },
    other: {
      age: {
        value: { type: Date, default: null },
        desc: String,
      },
      sex: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      height: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      weight: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      race: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      Hometown: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      politicalStatus: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
      marritalState: {
        value: { type: String, default: null },
        placeholder: String,
        desc: String,
      },
    },
  },
  { autoCreate: true }
);

basicSchema.plugin(mongoosePaginate);
basicSchema.plugin(idPlugin);

const Basic = mongoose.model("Basic", basicSchema);

module.exports = Basic;
