const path = process.cwd();
const Polls = require('../models/polls.js');
const assert = require('assert');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	// Handler for internal server errors
	function errorHandler(err, req, res, next) {
	    console.error(err.message);
	    console.error(err.stack);
	    res.status(500).json({error: err});
	}

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			Polls.find({}, function(err, polls) {
				assert.equal(null, err);
				res.render(path + '/public/index.hbs', {polls: polls});
			});
		});

	app.route('/login')
		.get(function (req, res) {
			Polls.find({}, function(err, polls) {
			    assert.equal(null, err);
				res.render(path + '/public/login.hbs', {polls: polls});
			});
		});
		
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
	
	app.route('/new_poll')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/new_poll.hbs');
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
	
	app.route('/polls/:id')
		.get(function(req, res) {
			Polls.findOne({_id: req.params.id}, function(err, poll) {
					assert.equal(null, err);
					var userID = req.user ? req.user.id : "";
					res.render(path + '/public/show_poll.hbs', { owner: poll.owner == userID, logged: req.isAuthenticated(), labels: JSON.stringify(poll.labels), labelsNames: poll.labelsNames, title: poll.title.toUpperCase(), id: req.params.id });
			});
		});
		
	app.route('/polls/:id/delete')
		.delete(isLoggedIn, function(req,res) {
			 Polls.findByIdAndRemove(req.params.id, function(err, data) {
			    	assert.equal(null, err);
			    	console.log("Data deleted: " + data);
			});
		});
	
	app.route('/polls/:id/vote')
		.post(function(req,res){
			Polls.findByIdAndUpdate(req.params.id, {$inc: {[`labels.${req.body.label}`]: 1 }}, function(err, newData){
			      assert.equal(null, err);
			      res.redirect('/polls/' + req.params.id);
			  });
		});
		
	app.route('/api')
		.get(function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	
	app.get("getError", function(req,res,next) {
		next("Yes an erro9r!!!");
	});
	
	app.use(errorHandler);

	app.use(function(req, res) {
		res.sendStatus(404);
	});
	
};