const path = process.cwd();
const Polls = require('../models/polls.js');
const assert = require('assert');
const authorizationRoutes = require("./auth.js");
const pollsRoutes = require("./polls.js");

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
	
	app.use('/polls', pollsRoutes);

	app.use('/auth/github', authorizationRoutes);
		
	app.use(errorHandler); // Server errors

	app.use(function(req, res) { // Client errors (not found)
		res.sendStatus(404);
	});
	
};