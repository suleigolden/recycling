let mongoose = require('mongoose');

//Recycling Schema
let recyclingSchema  = mongoose.Schema({
  Month:{
    type: String,
    required: true
  },
  NumberOfIntervalContainers:{
    type: String,
    required: true
  },
  NumberOfDemandcontainers:{
    type: String,
    required: true
  },
  TotalOrdersPerMonth:{
    type: String,
    required: true
  },
  OrderType:{
    type: String,
    required: true
  },
  OrderOrganized:{
    type: String,
    required: true
  },
  TotalOfDifferentRecyclers:{
    type: String,
    required: true
  },
  CostOfApp:{
    type: String,
  },
  TimeSaving:{
    type: String,
  },
  CostSaving:{
    type: String,
  }
});


let Recycling = module.exports = mongoose.model('Recycling', recyclingSchema);
