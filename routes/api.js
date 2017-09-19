var express = require('express');
var fs = require('fs');
var router = express.Router();
var yaml = require('js-yaml');
var https = require('https');
var unzip = require('unzip'); 



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

router.post('/createDir', function(req, res, next) {

	if (!fs.existsSync('./elk')){
		fs.mkdirSync('./elk');
		res.end(0) 		
	}
}); 


router.get('/downloadStack', function(req, res, next) {

	var stack = {

		"elasticsearch":{
			"url":{
				"linux":"https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.1.zip",
				"windows":"https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.1.zip"
			},
			"version":"5.6.1"
		},

		"kibana":{
			"url":{
				"linux":"https://artifacts.elastic.co/downloads/kibana/kibana-5.6.1-linux-x86_64.tar.gz",
				"windows":"https://artifacts.elastic.co/downloads/kibana/kibana-5.6.1-windows-x86.zip"
			},
			"version":"5.6.1"
		},

		"logstash":{
			"url":{
				"linux":"https://artifacts.elastic.co/downloads/logstash/logstash-5.6.1.zip",
				"windows":"https://artifacts.elastic.co/downloads/logstash/logstash-5.6.1.zip"
			},
			"version":"5.6.1"
		}

	}

	var stackName = req.query.stack; 

	var file = fs.createWriteStream("./elk/"+stackName+".zip");
	
	https.get(stack[stackName].url.windows, async (response) => {

		var stream  = await response.pipe(file);

		stream.on('finish', () => { 

			fs.createReadStream('./elk/'+stackName+'.zip').pipe(unzip.Extract({ path: './elk/'+stackName}));

			res.end(0) 

		} );


	});



})




module.exports = router;
