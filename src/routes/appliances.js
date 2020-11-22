const express = require('express');
const moment = require('moment');


const ApplianceModel = require('../models/Appliance');

const router = express.Router();

const addProperty = (fromObj, toObj, property) => {
  if (fromObj[property]) toObj[property] = fromObj[property];
};

router.get('/appliances', async (req, res) => {
  const paginationParams = {
    limit: +req.query._limit || 10,
    skip: +req.query._limit * (+req.query._page - 1) || 0,
  };

  const filterParams = {};

  addProperty(req.query, filterParams, 'serialNumber');
  addProperty(req.query, filterParams, 'brand');
  addProperty(req.query, filterParams, 'model');
  addProperty(req.query, filterParams, 'status');
  // addProperty(req.query, filterParams, 'dateBought');
  if (req.query.dateBought) {
    filterParams.dateBought = {
      $gte: moment(+req.query.dateBought).startOf('day').valueOf(),
      $lte: moment(+req.query.dateBought).endOf('day').valueOf(),
    };
  }

  console.log('##### filterParams', filterParams);

  // console.log('##### req.query.dateBought', req.query.dateBought);
  // console.log('##### moment(req.query.dateBought)', moment(+req.query.dateBought).format());

  try {
    const appliancesCount = await ApplianceModel.countDocuments(filterParams);
    res.set('X-Total-Count', appliancesCount);

    const appliancesRes = await ApplianceModel.find(
      filterParams,
      null,
      paginationParams
    );

    res.json(appliancesRes);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.post('/appliances', async (req, res) => {
  const newAppliance = new ApplianceModel(req.body);
  try {
    const applianceRes = await newAppliance.save();
    console.log('##### applianceRes', applianceRes);

    res.json(applianceRes);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.put('/appliances/:id', async (req, res) => {
  try {
    const applianceRes = await ApplianceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    console.log('##### applianceRes', applianceRes);

    res.json(applianceRes);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.delete('/appliances/:id', async (req, res) => {
  try {
    const applianceRes = await ApplianceModel.findByIdAndRemove(req.params.id);
    console.log('##### applianceRes', applianceRes);

    res.json(applianceRes);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

module.exports = router;
