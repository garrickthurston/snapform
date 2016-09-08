//BASE SETUP
//===============

//call needed packages
var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	fs = require('fs');

//connect to database
mongoose.connect("mongodb://localhost/snapform");

//serve static files
app.use(express.static('./public'));

var port = process.env.PORT || 8080;




// START THE SERVER
//=====================
app.listen(port);
console.log('Server running on localhost:' + port);