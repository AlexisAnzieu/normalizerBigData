var express = require('express');
var router = express.Router();
var os = require('os');
var colors = require('colors');
var fs = require('fs');
var {exec} = require('child_process');

const ROOT = ".";
const REQUIRED_MEMORY = 2; 
const JAVA_VERSION = 8;
const RANDOMNESS = 1000;
const OS = os.platform(); 

const constant = {ROOT,REQUIRED_MEMORY,JAVA_VERSION,RANDOMNESS,OS}; 

/* GET home page. */
router.get('/', async (req, res, next) => {

	var global={}; 

	global.constant = constant; 
	global.total = {"java":20,"memoire":15,"random":10,"files":5,"somme":50}; 


	global.java = await User('java -version');
	global.files = await checkDir(ROOT); 
	global.ram = await checkRAM(); 
	global.random = await checkRandom(); 
	global.result = global.java.note + global.ram.note + global.random.note + global.files.note;

	res.render('index', { global });



}); 





function checkRAM(){

	return new Promise(

		function (resolve, reject) {

			const GIGA = 1 / (Math.pow(1024,3));

			let total = Math.round(os.totalmem()*GIGA,2);
			let free = Math.round(os.freemem()*GIGA,2);

			console.log("\n"); 
			console.log("============================="); 
			console.log("Operating System :",OS); 
			console.log("Total memory :",total,"Gbs"); 
			console.log("Available memory :",free,"Gbs"); 
			console.log("============================="); 


			if (total<REQUIRED_MEMORY){ 
				console.log(colors.red("You only get",total,"Gbs on this machine (minimum :",REQUIRED_MEMORY,"Gb)"));
				resolve({OS,total,free,"note":0}); 

			}else if (free<REQUIRED_MEMORY){
				console.log(colors.yellow("WARNING : You only get",free,"Gbs free available, your will have a poor experience (minimum :",REQUIRED_MEMORY,"Gb)")); 
				resolve({OS,total,free,"note":7}); 

			}else{
				console.log(colors.green("Enough RAM"));
				resolve({OS,total,free,"note":15}); 
			}



		}); 



}


function User(cmd) {
	return new Promise(

		function (resolve, reject) {

			exec(cmd, function (error, stdout,stderr) {
				if (error) {
					console.error(colors.red("Java is not installed"));
					resolve({"note":0}); 
				}
				data = stderr.toString().split('\n')[0];
				let javaVersionTmp = new RegExp('java version').test(data) ? data.toString().split(' ')[2].replace(/"/g, '') : false;
				let javaVersion = javaVersionTmp.toString().split('.')[1];

				if (javaVersion>=JAVA_VERSION){
					console.log(colors.green("Java is correctly intalled"));
					resolve({javaVersion,"note":20}); 
				}else{
					console.log(colors.red("Java version ",javaVersion,"is not supported (minimum : Java ",JAVA_VERSION,")"));
					resolve({javaVersion,"note":0}); 
				}

			});

		});

}


function checkRandom(osType){

	return new Promise(

		function (resolve, reject) {


			if (OS.indexOf("win") !== -1){
				resolve({"data":"windows","note":10}); 
			}else{
				fs.readFile('/proc/sys/kernel/random/entropy_avail', 'utf8', function (err,data) {
					if (err) {
						reject(err);
					}

					if (data>1000) resolve({data,"note":10}) 
						else resolve({data,"note":data/100}) 

					});
			}



		}); 

}



	function checkDir(dir) {

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


		return new Promise(

			function (resolve, reject) {

				var fileList=[]; 

				fs.readdir(dir, (err, files) => {

					if (err) {
						reject(err);
					}

					if (files.indexOf("elk") > -1) {

						fs.readdir(dir+"/elk", (err, files) => {

							if (err) {
								reject(err);
							}

							var stackList = ""; 
							var needed = 0; 

							if (files.indexOf("kibana") === -1) {
								stackList+='<a class="btn tooltipped" data-position="bottom" data-tooltip="Télécharger Kibana" id="kibana" href="#">kibana</a>  '; 
								needed++; 

							}
							if (files.indexOf("logstash") === -1) {
								stackList+='<a class="btn tooltipped" data-position="bottom" data-tooltip="Télécharger logstash" id="logstash" href="#">logstash</a>  '; 
								needed++;

							}
							if (files.indexOf("elasticsearch") === -1) {
								stackList+='<a class="btn tooltipped" data-position="bottom" data-tooltip="Télécharger elasticsearch" id="elasticsearch" href="#">elasticsearch</a>  '; 
								needed++;
							}

							if (needed!=0){
								resolve({"message":"Dossier ELK détecté. <br>Éléments manquants de la stack ELK:<br><br>"+stackList,"note":5-needed});
							} else {
								resolve({"message":"Tous les fichiers sont présents","note":15}); 
							}
						})

					}else{
						resolve({"message":"Aucun dossier ELK détecté. <br><br><a class='btn' id='createDir' href='#'>Créer le dossier</a>","note":0}); 
					}


				})

			}); 
	} 




module.exports = router;
