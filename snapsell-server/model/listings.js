/* Admission Number: 1935996
   Name: Alwinderjit Singh Basant
   Class:  DIT / FT / 1B / 01 */

//Defines the database connection configuration
var db = require('./databaseConfig.js');

var listings = {
    //All functions declared are stored in variable 'listings' which is then exported for use in app.js to call the function
    findAll: function (callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = 'SELECT * FROM listings';

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

    findById: function (userid, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `SELECT * FROM listings WHERE fk_poster_id = ?`;

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


    findByName: function (name, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `SELECT listings.listingid FROM listings WHERE listings.title = ?`;

                conn.query(sql, [name], function (err, result) {
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


    addListing: function (title, description, price, posterid, image, title, callback) { //METHOD: POST

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                // multipleStatements: true is defined in database config.js which allows both statements to be executed
                var sql = `INSERT INTO listings(title, description, price, fk_poster_id, listings_pic) values(?, ?, ?, ?, ?);
                SELECT listings.listingid FROM listings WHERE listings.title = ?`;

                conn.query(sql, [title, description, price, posterid, image, title], function (err, results) {
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

    },


    delListing: function (id, id, callback) { //METHOD: DELETE

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                //Delete the foreign key of that listingid in offers first so that listingid can be deleted, otherwise there would be a foreign key constraint error
                var sql = 'DELETE FROM offers WHERE fk_listing_id = ?;DELETE FROM listings WHERE listingid = ?;';

                conn.query(sql, [id, id], function (err, results) {
                    conn.end(); // new connect end location
                    if (err) {
                        return callback(err, null);

                    } else {
                        return callback(null, results[1].affectedRows);

                    }
                });

            }

        });

    },


    findByListingId: function (listingid, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `SELECT * FROM listings WHERE listingid = ?`;

                conn.query(sql, [listingid], function (err, result) {
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


    alterListing: function (title, description, price, fk_poster_id, listings_pic, listingid, callback) { //METHOD: PUT

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = `UPDATE listings
            SET 
            title = ?,
            description = ?,
            price = ?,
            fk_poster_id = ?,
            listings_pic = ?
            WHERE listingid = ?;`;

                conn.query(sql, [title, description, price, fk_poster_id, listings_pic, listingid], function (err, result) {
                    conn.end(); // new connect end location

                    if (err) {
                        return callback(err, null);

                    } else {
                        //Return affected Rows
                        return callback(null, result.affectedRows);

                    }
                });

            }

        })
    },

    findOffersById: function (listingid, callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql = 'SELECT * FROM offers WHERE fk_listing_id = ?';

                conn.query(sql, [listingid], function (err, result) {
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

    addOffer: function (offer, fklistingid, fkofferorid, fklistingid, offer, fkofferorid, callback) { //METHOD: POST

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                // multipleStatements: true is defined in database config.js which allows both statements to be executed
                var sql = `INSERT INTO offers(offer, fk_listing_id, fk_offeror_id) values(?, ?, ?);
                SELECT offers.offerid FROM offers WHERE offers.fk_listing_id = ? AND offers.offer = ? AND offers.fk_offeror_id = ?`;
                //Second SQL statements selects the id of the newly added offer

                conn.query(sql, [offer, fklistingid, fkofferorid, fklistingid, offer, fkofferorid], function (err, results) {
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

    },

    findAllListingLikes: function (callback) { //METHOD: GET

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                var sql =
                    `SELECT fk_listinglike_id, fk_user_id FROM likes 
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

    }
}

module.exports = listings;