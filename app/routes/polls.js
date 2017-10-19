const express = require('express');
const router = express.Router();
const path = process.cwd();
const Polls = require('../models/polls.js');
const assert = require('assert');

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}
	
router.route('/polls/new')
        .get(isLoggedIn, function (req, res) {
			res.render(path + '/public/pages/make_new_poll.hbs');
		})
		.post(isLoggedIn, function(req, res) {
			  const labelsNames = req.body.labels.split(/\r?\n/)
												 .slice(0,7)
												 .filter( (val, idx, arr) => arr.indexOf(val) === idx && val !== "" );
			  let labels = {};
			  labelsNames.forEach( labelName => labels[labelName] = 0 );
			  const polls = new Polls({
			    title: req.body.title,
			    labelsNames: labelsNames,
			    labels: labels,
			    owner: req.user.id
			  })
			  polls.save(function(err, data) {
			      assert.equal(null, err);
			      res.redirect('/polls/' + data._id);
			  });
		});
		
router.post('/polls/:id/vote', function(req,res){
		Polls.findByIdAndUpdate(req.params.id, {$inc: {[`labels.${req.body.label}`]: 1 }}, function(err, newData){
		      assert.equal(null, err);
		      res.redirect('/polls/' + req.params.id);
		  });
	});
	
router.get('/polls/:id', function(req, res) {
		Polls.findOne({_id: req.params.id}, function(err, poll) {
				assert.equal(null, err);
				var userID = req.user ? req.user.id : "";
				res.render(path + '/public/pages/show_poll.hbs', { owner: poll.owner == userID, logged: req.isAuthenticated(), labels: JSON.stringify(poll.labels), labelsNames: poll.labelsNames, title: poll.title.toUpperCase(), id: req.params.id });
		});
	});
	
router.delete('/polls/:id/', isLoggedIn, function(req,res) {
		 Polls.findByIdAndRemove(req.params.id, function(err, data) {
		    	assert.equal(null, err);
		    	console.log("Data deleted: " + data);
		});
	});
	
module.exports = router;