/* Admission Number: 1935996
   Name: Alwinderjit Singh Basant
   Class:  DIT / FT / 1B / 01 */


var app=require('./controller/app.js'); //Defines the module 'app' through the path of the file
var port=3000; //Defines the port that will be used

var server=app.listen(port,function(){ //Listens to the server with the variable 'port' passed to it

    console.log("App hosted at localhost:"+port);

    
});