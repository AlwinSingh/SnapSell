/* Admission Number: 1935996
   Name: Alwinderjit Singh Basant
   Class:  DIT / FT / 1B / 01 */


var mysql=require('mysql');
//Uses the mysql module

var dbConnect={

    getConnection:function(){
        var conn=mysql.createConnection({
            host:"localhost", //Localhost - 127.0.0.1
            user:"root", //Username for valid connection
            password:"Wolfteam911", //Password for valid connection
            database:"snapsell", //Define the database name / schema name
            dateStrings: true, //Changes the date to String
            multipleStatements: true //Allows multiple statements to be executed in one connection query

        }

        );

        return conn;
        //Returns the variable 'conn' which creates a SQL connection with the parameters needed to define the server and additional information

    }
}
module.exports=dbConnect;
//To use the databaseconfig in otherfiles, the module must first be exported