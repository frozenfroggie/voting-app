const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', 
            {
    			successRedirect: '/',
    			failureRedirect: '/login'
    		}
		));
			
router.get('/api', function (req, res) {
			res.json(req.user.github);
		});
		
module.exports = router;