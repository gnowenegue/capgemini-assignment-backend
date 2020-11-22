const mongoose = require('mongoose');

const applianceSchema = require('../schemas/appliance');

module.exports = mongoose.model('Appliance', applianceSchema);
