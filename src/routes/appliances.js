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

  if (req.query.dateBought) {
    filterParams.dateBought = {
      $gte: moment(+req.query.dateBought)
        .startOf('day')
        .valueOf(),
      $lte: moment(+req.query.dateBought)
        .endOf('day')
        .valueOf(),
    };
  }

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
    console.error(JSON.stringify(e));
    res.status(400).send({ message: e.message });
  }
});

router.post('/appliances', async (req, res) => {
  const { serialNumber, brand, model } = req.body;

  const duplicateApplianceRes = await ApplianceModel.find({
    serialNumber,
    brand,
    model,
  });

  if (duplicateApplianceRes.length) {
    return res.status(400).send({ message: 'Duplicate record found.' });
  }

  const newAppliance = new ApplianceModel(req.body);

  try {
    const applianceRes = await newAppliance.save();
    // console.log('##### applianceRes', applianceRes);

    res.json(applianceRes);
  } catch (e) {
    console.error(JSON.stringify(e));

    if (e.code === 11000)
      return res.status(400).send({ message: 'Duplicate record found.' });

    res.status(400).send({ message: e.message });
  }
});

router.put('/appliances/:id', async (req, res) => {
  const { serialNumber, brand, model } = req.body;

  const duplicateApplianceRes = await ApplianceModel.find({
    serialNumber,
    brand,
    model,
  });

  if (duplicateApplianceRes.length) {
    return res.status(400).send({ message: 'Duplicate record found.' });
  }

  try {
    const applianceRes = await ApplianceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    // console.log('##### applianceRes', applianceRes);

    res.json(applianceRes);
  } catch (e) {
    console.error(JSON.stringify(e));
    if (e.code === 11000)
      return res.status(400).send({ message: 'Duplicate record found.' });

    res.status(400).send({ message: e.message });
  }
});

router.delete('/appliances/:id', async (req, res) => {
  try {
    const applianceRes = await ApplianceModel.findByIdAndRemove(req.params.id);
    // console.log('##### applianceRes', applianceRes);

    res.json(applianceRes);
  } catch (e) {
    console.error(JSON.stringify(e));
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
