const mongoose = require('mongoose');
const { Schema } = mongoose;

const applianceSchema = new Schema(
  {
    serialNumber: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, required: true },
    dateBought: { type: Date, required: true },
  },
  { timestamps: true }
);

applianceSchema.index(
  { serialNumber: 1, brand: 1, model: 1 },
  { unique: true }
);

console.log('##### applianceSchema.indexes()', applianceSchema.indexes());

module.exports = applianceSchema;
