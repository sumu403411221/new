var express     =require("express");
var app         =express();
var bodyParser  =require("body-parser");
var request = require("request");
const pool  = require("./db");
const { Connection } = require("pg");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",async function(req,res){
	try{
		var url = "https://api.wazirx.com/api/v2/tickers";
		request(url,async function(error,response,body){
		
			if(!error && response.statusCode==200){

				await pool.query("DROP TABLE data");
				
				await pool.query("CREATE TABLE data(id int PRIMARY KEY,name1 varchar,last1 float,buy float,sell float,volume float,base_unit varchar)");

				var data = JSON.parse(body);
				var keys = Object.keys(data);
					
				for(var i=0;i<10;i++){
					var id = i+1;
					var name = data[keys[i]].name;
					var last = data[keys[i]].last;
					var buy = data[keys[i]].buy;
					var sell = data[keys[i]].sell;
					var volume = data[keys[i]].volume;
					var base_unit  = data[keys[i]].base_unit;
					console.log(id);
					await pool.query("INSERT INTO data(id,name1,last1,buy,sell,volume,base_unit) VALUES($1,$2,$3,$4,$5,$6,$7)",[id,name,last,buy,sell,volume,base_unit]);
					
				}
				const table_data = await pool.query("SELECT * FROM data");
				const req_data = table_data.rows;
				console.log(req_data[0].id);
		        res.render("index.ejs",{data:req_data});
				
			}
		})
	}catch(err){
		return err;
	}
})

app.listen(process.env.PORT || 3000,function(){
	console.log("server started");
})