const express = require("express");
const router = express.Router();

//Bring in recycling Models
let recyclingTable = require('../models/recycling');


//Calculate recycling Route
router.get('/recycling', (req, res) =>{
	let errors = {};
	let pageIn ="recycling";
	res.render('main-recycling',{errors:errors, pageIn:pageIn});
});

//Calculate and Save time/cost saving Route
  router.post('/calculateRecycling', (req, res) =>{
  req.checkBody('Month','Month is required').notEmpty();
  req.checkBody('NumberOfIntervalContainers','Number Of IntervalC ontainers is required').notEmpty();
  req.checkBody('NumberOfDemandcontainers','Number Of Demand Containers is required').notEmpty();
  req.checkBody('TotalOrdersPerMonth','Total Orders Per Month is required').notEmpty();
  req.checkBody('OrderType','OrderType is required').notEmpty();
  req.checkBody('OrderOrganized','How are the orders organized is required').notEmpty();
  req.checkBody('TotalOfDifferentRecyclers','How many different recyclers do you have is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if(errors){
  	let pageIn ="recycling";
	res.render('main-recycling',{errors:errors, pageIn:pageIn});
  }else{
  	//Time saving interval orders = 50% of above values as less attention is needed
	//Per month 2 hours basic time saving for reporting and accounting tasks
	let timeSavingIntervalOrders = 5;
	let basicTimeSaving = 2;
  	let additionalRecycler = req.body.TotalOfDifferentRecyclers * 3;
  	let totalTimeSaving =  timeSavingIntervalOrders + additionalRecycler + basicTimeSaving;
  	let laborCost = 75;
  	let costSaving = laborCost * totalTimeSaving;
  	let AppCost = '';
  	if(req.body.NumberOfDemandcontainers <= 3){ 
  		AppCost = 'Free';
	 }else if(req.body.NumberOfDemandcontainers <= 8){
	 	AppCost = '19 EUR/month';
	 }else if(req.body.NumberOfDemandcontainers > 8){
	 	AppCost = '45 EUR/month';
	 }

  	// console.log("Time Saving: "+totalTimeSaving);
  	// res.redirect('/recyclings/recycling');
  	let recycling = new recyclingTable();
	  recycling.Month = req.body.Month;
	  recycling.NumberOfIntervalContainers = req.body.NumberOfIntervalContainers;
	  recycling.NumberOfDemandcontainers = req.body.NumberOfDemandcontainers;
	  recycling.TotalOrdersPerMonth = req.body.TotalOrdersPerMonth;
	  recycling.OrderType = req.body.OrderType;
	  recycling.OrderOrganized = req.body.OrderOrganized;
	  recycling.TotalOfDifferentRecyclers = req.body.TotalOfDifferentRecyclers;
	  recycling.CostOfApp = AppCost;
	  recycling.TimeSaving = totalTimeSaving;
	  recycling.CostSaving = costSaving;

	  recycling.save( (err)=>{
	    if (err) {
	      console.log(err);
	      return;
	    }else {
	        req.flash('Success','Recycling Added');
	        let pageIn ="ManageRecyclings";
			 recyclingTable.find({}, (err, recyclings) =>{

				if(err){
					console.log(err);
				}else{
					//res.redirect('/');
					res.redirect('/recyclings/ManageRecyclings/?recyclings='+recyclings);
					//res.redirect('/recyclings/ManageRecyclings', {recyclings: recyclings, pageIn:pageIn});
				}
			});
	    }
	  });
  }

});

//Manage recycling Route
router.get('/ManageRecyclings', (req, res) =>{
	let pageIn ="ManageRecyclings";
	 recyclingTable.find({}, (err, recyclings) =>{

		if(err){
			console.log(err);
		}else{
			res.render('ManageRecyclings', {recyclings: recyclings, pageIn:pageIn});
		}
	});
});

//Delete recycling through Ajax request
router.delete('/:id', (req, res) =>{
	let query = {_id:req.params.id}

	recyclingTable.remove(query, (err)=>{
    if (err) {
      console.log(err);
      return;
    }
      res.send('success');
    
  });

});

//Edit recycling Route
router.get('/edit/recycling/:id', (req, res) =>{
	let pageIn ="EditRecyclings";
	let errors = {};
 	recyclingTable.findById(req.params.id, (err, recycling) =>{
 		if (err) {
	      console.log(err);
	      return;
	    }else {
	     res.render('edit_recycling', {recycling:recycling, errors:errors,pageIn:pageIn});
	    }
 		
 	}); 
	
});
//Update recycling Route
router.post('/update/:id', (req, res) =>{
  let recycling = {};
  let timeSavingIntervalOrders = 5;
  let basicTimeSaving = 2;
  let additionalRecycler = req.body.TotalOfDifferentRecyclers * 3;
  let totalTimeSaving =  timeSavingIntervalOrders + additionalRecycler + basicTimeSaving;
  let laborCost = 75;
  let costSaving = laborCost * totalTimeSaving;
  let AppCost = '';
  if(req.body.NumberOfDemandcontainers <= 3){ 
 	AppCost = 'Free';
  }else if(req.body.NumberOfDemandcontainers <= 8){
	AppCost = '19 EUR/month';
  }else if(req.body.NumberOfDemandcontainers > 8){
	AppCost = '45 EUR/month';
  }
  recycling.Month = req.body.Month;
  recycling.NumberOfIntervalContainers = req.body.NumberOfIntervalContainers;
  recycling.NumberOfDemandcontainers = req.body.NumberOfDemandcontainers;
  recycling.TotalOrdersPerMonth = req.body.TotalOrdersPerMonth;
  recycling.OrderType = req.body.OrderType;
  recycling.OrderOrganized = req.body.OrderOrganized;
  recycling.TotalOfDifferentRecyclers = req.body.TotalOfDifferentRecyclers;
  recycling.CostOfApp = AppCost;
  recycling.TimeSaving = totalTimeSaving;
  recycling.CostSaving = costSaving;

  let query = {_id:req.params.id}

  recyclingTable.update(query,recycling, (err)=>{
    if (err) {
      console.log(err);
      return;
    }else {
      req.flash('success','Recycling Updated');
      res.redirect('/recyclings/ManageRecyclings/');
    }
  });

});


module.exports = router;