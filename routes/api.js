var express = require('express');
var fs = require('fs');
var router = express.Router();
var yaml = require('js-yaml');


router.post('/updateConfig', function(req, res, next) {

	fs.readFile('./config.yml','utf8', (err, data) => {
		if (err) throw err;

		var savedConfig = req.body; 

		for (param in savedConfig){
			var replace = param+".*";
			var regex = new RegExp(replace,"g");
			data = data.replace(regex,param+": "+savedConfig[param]);	
		}


		fs.writeFile('./config.yml', data, (err) => {
			if (err) throw err;
			res.redirect('/config');
		});


	});






});

module.exports = router;
