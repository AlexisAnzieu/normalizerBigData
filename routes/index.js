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

const constant = {ROOT,REQUIRED_MEMORY,JAVA_VERSION,RANDOMNESS}; 

/* GET home page. */
router.get('/', function(req, res, next) {

	var global={}; 

	global.constant = constant; 
	global.total = {"java":20,"memoire":15,"random":10,"somme":45}; 

	User('java -version')
	.then(java=>{ 
		global.java = java; 
		return checkFiles(); 

	})
	.then(fileList=>{
		global.fileList = fileList; 
		return checkRAM();  

	})
	.then( ram=>{
		global.ram = ram; 
		return checkRandom(ram.osType); 

	})
	.then( random=>{
		global.random = random; 

		global.result = global.java.note + global.ram.note + global.random.note

		res.render('index', { global });	

	});
	

}); 


function checkRAM(){

	return new Promise(

		function (resolve, reject) {

			const GIGA = 1 / (Math.pow(1024,3));

			let total = Math.round(os.totalmem()*GIGA,2);
			let free = Math.round(os.freemem()*GIGA,2);
			let osType = os.platform(); 

			console.log("\n"); 
			console.log("============================="); 
			console.log("Operating System :",osType); 
			console.log("Total memory :",total,"Gbs"); 
			console.log("Available memory :",free,"Gbs"); 
			console.log("============================="); 


			if (total<REQUIRED_MEMORY){ 
				console.log(colors.red("You only get",total,"Gbs on this machine (minimum :",REQUIRED_MEMORY,"Gb)"));
				resolve({osType,total,free,"note":0}); 

			}else if (free<REQUIRED_MEMORY){
				console.log(colors.yellow("WARNING : You only get",free,"Gbs free available, your will have a poor experience (minimum :",REQUIRED_MEMORY,"Gb)")); 
				resolve({osType,total,free,"note":7}); 

			}else{
				console.log(colors.green("Enough RAM"));
				resolve({osType,total,free,"note":15}); 
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

function checkFiles(){

	return new Promise(

		function (resolve, reject) {

			var fileList=[]; 

			fs.readdir(ROOT, (err, files) => {

				files.forEach(file => {
					fileList.push(file)

				});

				resolve(fileList); 
			})

		}); 
}


function checkRandom(osType){

	return new Promise(

		function (resolve, reject) {


			if (osType.indexOf("win") !== -1){
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




module.exports = router;
