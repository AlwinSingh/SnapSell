/* Admission Number: 1935996
   Name: Alwinderjit Singh Basant
   Class:  DIT / FT / 1B / 01 */


//Defines the database connection configuration
var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const saltRounds = 10;


var users = {
    //All functions declared are stored in variable 'users' which is then exported for use in app.js to call the function
    findAll: function (callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) { //Start the connection
            if (err) { //If there is a error in the connection, log it otherwise run the sql queries
                console.log(err);
                return callback(err, null);
            } else {

                var sql = 'SELECT * FROM users;'; //SQL Query

                conn.query(sql, [], function (err, result) {
                    conn.end(); // new connect end location, releases the connection
                    if (err) {
                        return callback(err, null); //Return error and no data/result

                    } else {

                        return callback(null, result); //Return data/result and no error

                    }
                });

            }

        });

    },


    loginUser: function (username, password, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");

                var sql = 'select * from users where username=?';

                conn.query(sql, [username], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log("Err: " + err);
                        return callback(err, null, null);
                    } else {
                        var token = "";
                        var i;
                        for (i = 0; i < result.length; i++) {
                            hash = result[i].password;
                            bcrypt.compare(password, hash, function (err, res) {
                                if (res) {
                                    token = jwt.sign({
                                        id: result[0].userid,
                                        role: result[0].role
                                    }, config.key, {
                                        expiresIn: 86400 //expires in 24 hrs
                                    });
                                    console.log("@@token " + token);
                                    return callback(null, token, result);
                                } //if(res)
                                else {
                                    console.log("password does not match");
                                    var err2 = new Error("Password does not match.");
                                    err2.statusCode = 404;
                                    console.log(err2);
                                    return callback(err2, null, null);
                                }
                            }); //bcrypt.compare
                        } //for loop						
                    } //else
                });
            }
        });
    },


    alterUser: function (username, profile_pic_url, userid, callback) { //METHOD: PUT

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `UPDATE users
            SET username = ?, profile_pic_url = ?
            WHERE id = ?;`;
                //Variables passed are in order to the question marks, they go to the respective inputs
                //Variables passed can be more than once
                conn.query(sql, [username, profile_pic_url, userid], function (err, result) {
                    conn.end(); // new connect end location

                    if (err) {
                        return callback(err, null);

                    } else {
                        //Return affected Rows, such as those that have been deleted or edited
                        return callback(null, result.affectedRows);

                    }
                });

            }

        })
    },


    addUsers: function (username, profile_pic_url, password, username, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                bcrypt.hash(password, saltRounds, function (err, hash) {

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }

                    password = hash;

                    console.log("Connected!");
                    sqlStr = `Insert into users(username, profile_pic_url, password) values(?,?,?);
                    SELECT users.id FROM users WHERE username = ?;`
                    conn.query(sqlStr, [username, profile_pic_url, password, username], function (err, results) {
                        conn.end();

                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, results[1]);
                        }
                    });
                });
            }
        });
    },

    findUserOffers: function (userid, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `select listings.title, offer, users.username
                from snapsell.users, snapsell.offers, snapsell.listings
                where fk_poster_id = ?
                && users.id = fk_offeror_id 
                && listings.listingid = fk_listing_id
                && fk_offeror_id != fk_poster_id;`

                conn.query(sql, [userid], function (err, result) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });

    },


    findById: function (userid, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `SELECT * FROM users WHERE id = ?`;

                conn.query(sql, [userid], function (err, result) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });

    },



    delUser: function (userid, callback) { //METHOD: DELETE

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `DELETE FROM users WHERE users.id = ?`;

                conn.query(sql, [userid], function (err, result) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });

    },



    likeListing: function (callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql =
                    `SELECT * FROM likes 
                INNER JOIN users ON
                likes.fk_user_id = users.id
                INNER JOIN listings ON
                listings.listingid = likes.fk_listinglike_id`;

                conn.query(sql, [], function (err, result) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });

    },

    likeListingById: function (id, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql =
                    `SELECT * FROM likes 
                INNER JOIN users ON
                likes.fk_user_id = users.id
                INNER JOIN listings ON
                listings.listingid = likes.fk_listinglike_id
                WHERE likes.fk_user_id = ?`;

                conn.query(sql, [id], function (err, result) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });

    },

    unlike: function (userid, listingid, listingid, callback) { //METHOD: DELETE

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `DELETE FROM likes WHERE fk_user_id = ? and fk_listinglike_id = ?;
                UPDATE listings SET totallikes = totallikes - 1 WHERE listingid = ? AND totallikes > 0;`;

                conn.query(sql, [userid, listingid, listingid], function (err, result) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {
                        return callback(null, result.affectedRows);

                    }
                });

            }

        });

    },

    addLike: function (userid, listingid, userid, listingid, listingid, callback) { //METHOD: POST

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                // multipleStatements: true is defined in database config.js which allows both statements to be executed
                var sql = `INSERT INTO likes(fk_user_id, fk_listinglike_id) values(?, ?);
                SELECT likes.likeid FROM likes WHERE likes.fk_user_id = ? AND likes.fk_listinglike_id = ?;
                UPDATE listings SET totallikes = totallikes + 1 WHERE listingid = ?;`;

                conn.query(sql, [userid, listingid, userid, listingid, listingid], function (err, results) {
                    conn.end(); // new connect end location
                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {
                        //No error, return result
                        return callback(null, results[1]);

                    }
                });

            }

        });

    }

}

module.exports = users;