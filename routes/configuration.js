var express = require('express');
var fs = require('fs');
var router = express.Router();
var yaml = require('js-yaml');



/* GET users listing. */
router.get('/', function(req, res, next) {

	try {
		var doc = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
		console.log(doc);
	} catch (e) {
		console.log(e);
	}


	res.render('configuration', { doc });
});

module.exports = router;
