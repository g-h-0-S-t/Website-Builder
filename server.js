// load the things we need
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var { c, cpp, node, python, java } = require('compile-run');
// set the view engine to ejs
app.set('view engine', 'ejs');

// to parse json data from ajax
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setting static file paths
app.use(express.static('styles'));
app.use(express.static('libs'));
app.use(express.static('node_modules'));
app.use(express.static('images'));
app.use(express.static('controller'));
app.use(express.static('ExcelFiles'));

// load all services
require('./services/serviceModuleCaller').loadServices(app, fs, java);

// start app
app.listen(8080);
console.log('8080 is the magic port');