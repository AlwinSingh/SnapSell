/* Admission Number: 1935996
   Name: Alwinderjit Singh Basant
   Class:  DIT / FT / 1B / 01 */

var express = require('express');
const multer = require('multer'); //Defines the multer module that is used to upload / store / retrieve images
const path = require('path');
var app = express();
const cors = require("cors");

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload'); //Define the folder's name for the images to be sent to
    },

    // By default, multer removes file extensions this will add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + randomnumber + '.jpg')
    }
});

var upload = multer({
    storage: storage
})

var sizeOf = require('image-size'); //JS Module that allows you to retrieve details of images such as height, width, etc

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);
const Users = require("../model/users.js");
const Listings = require("../model/listings.js");
var verifyToken = require('../auth/verifyToken.js');

app.get("/users", (req, res, next) => { //METHOD: GET RETRIEVES ALL STUDENT DATA
    Users.findAll((error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occured\" }");
            return;
        };
        // If no error send 200 code, with result, else send 500 code with error message
        res.status(200).send(result);
    });
});


app.post("/users", (req, res, next) => { //METHOD: POST
    //Retrieves the data from the body of POSTMAN
    var username = req.body.username;
    var profile_pic_url = req.body.profile_pic_url;
    var password = req.body.password;

    //Variables are passed accordingly
    Users.addUsers(username, profile_pic_url, password, username, function (err, result) {
        if (!err) {
            res.status(201);
            res.send(result);
        } else {
            console.log(err);
            res.status(500);
            //res.send(err.statusCode);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        }
    });
});

app.post('/user/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    Users.loginUser(username, password, function (err, token, result) {
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password']; //clear the password in json data, do not send back to client
            console.log(result);
            res.json({
                success: true,
                UserData: JSON.stringify(result),
                token: token,
                status: 'You are successfully logged in!'
            });
            res.send();
        } else {
            res.status(500);
            res.sendStatus(err.statusCode);
        }
    });
});

app.get("/users/:id", (req, res, next) => {
    var userid = req.params.id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(userid) || userid.length < 1 || userid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid UserID\" }");
        return;
    }


    Users.findById(userid, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        if (result.length >= 1) {
            res.status(200).send(result);
            return;
        } else {
            res.status(404).send("{ \"Message\" : \"No User Found\" }");
            return;
        }
    });
});



app.delete("/users/:id", (req, res, next) => {
    var userid = req.params.id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(userid) || userid.length < 1 || userid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid UserID\" }");
        return;
    }


    Users.delUser(userid, (error, result) => {
        // if (result.length > 0) {
        //     res.status(200).send(result);
        //     return;
        // } else {
        //     res.status(404).send("{ \"Message\" : \"No User Found\" }");
        //     return;
        // }

        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };
    });
});



app.put("/users/:id", (req, res, next) => {
    var username = req.body.username;
    var profile_pic_url = req.body.profile_pic_url;

    var userid = req.params.id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(userid) || userid.length < 1 || userid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid UserID\" }");
        return;
    }

    Users.alterUser(username, profile_pic_url, userid, function (err, result) {

        if (!err) {
            var resultstr = result.toString();
            if (result > 0) {
                res.status(204);
                res.send("{\"Affected Rows\":\"" + resultstr + "\"}"); //Will not display as status is 204. No content.
            } else {
                res.status(500);
                res.send("{\"Message\":\"Some error occurred [The company id may not exist in the database]\"}");
                return;
            }
        } else {

            if (err.code === "ER_DUP_ENTRY") {
                res.status(422);
                res.send("{ \"Message\" : \"Username provided already exists\" }");
                return;
            } else {
                console.log(err);
                res.status(500);
                res.send("{ \"Message\" : \"Some error occurred\" }");
                return;
            }
        }
    });
});



app.get("/users/:user_id/listings", (req, res, next) => {
    var userid = req.params.user_id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(userid) || userid.length < 1 || userid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid UserID\" }");
        return;
    }


    Listings.findById(userid, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
        };

        res.status(200).send(result);
    });
});


app.get("/listings", (req, res, next) => {

    Listings.findAll((error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});



app.get("/listings/:listing_id", (req, res, next) => {
    var listingid = req.params.listing_id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(listingid) || listingid.length < 1 || listingid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid ListingID\" }");
        return;
    }


    Listings.findByListingId(listingid, (error, result) => {
        if (result.length < 1) {
            res.status(404).send("{ \"Error\" : \"No listing with that ID was found\" }");
            return;
        }

        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});

app.post("/listings", (req, res, next) => {
    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var fk_poster_id = req.body.fk_poster_id;
    var image = req.body.image_url;

    Listings.addListing(title, description, price, fk_poster_id, image, title, function (err, result) {
        if (!err) {
            res.status(201);
            res.send(result);
        } else {
            console.log(err);
            res.status(500);
            //res.send(err.statusCode);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        }
    });
});


app.get("listings/name/:name", (req, res, next) => {
    var name = req.params.name;

    Listings.findByName(name, (error, result) => {
        if (error) {
            console.log(error);
            res.send("{ \"Message\" : \"Internal Server Error\" }");
            return;
        } else {
            res.status(200).send("{ \"Listing ID is\" : \"" + result + "\" }");
            console.log("Listing id is " + result);
            return;
        }
    });
});

app.delete("/listings/:id", (req, res, next) => {
    var id = parseInt(req.params.id);


    Listings.delListing(id, id, (error, result) => {
        if (error) {
            console.log(error);
            res.send("{ \"Message\" : \"Internal Server Error\" }");
            return;
        } else {
            if (result > 0) { //If the number of affected rows is more than 0, it means there is a result
                var resultstr = result.toString();
                res.status(200).send("{\"Affected Rows\":\"" + resultstr + "\"}");
                console.log("Deleting listing " + id);
                return;
            } else {
                res.status(500).send("{ \"Message\" : \"Internal Server Error\" }");
                console.log("Listing with ID of " + id + " does not exist");
                return;
            }

        }
    });
});




app.put("/listings/:id", (req, res, next) => {
    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var fk_poster_id = req.body.fk_poster_id;
    var listings_pic = req.body.listings_pic;

    var listingid = req.params.id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(listingid) || listingid.length < 1 || listingid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid UserID\" }");
        return;
    }

    Listings.alterListing(title, description, price, fk_poster_id, listings_pic, listingid, function (err, result) {

        if (!err) {
            var resultstr = result.toString();
            if (result > 0) {
                res.status(204);
                res.send("{\"Affected Rows\":\"" + resultstr + "\"}"); //Will not display as status is 204. No content.
            } else {
                res.status(500);
                res.send("{\"Message\":\"Error 500 Internal Server Error\"}");
                return;
            }
        } else {

            if (err.code === "ER_DUP_ENTRY") { //If there is a duplicate entry for a unique key then status is 422 'UNPROCESSABLE ENTITY'
                res.status(422);
                res.send("{ \"Message\" : \"Title already exists\" }");
                return;
            } else {
                console.log(err);
                res.status(500);
                res.send("{ \"Message\" : \"Some error occurred\" }");
                return;
            }
        }
    });
});


app.get("/listings/:id/offers", (req, res, next) => {
    var listingid = req.params.id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(listingid) || listingid.length < 1 || listingid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid ListingID\" }");
        return;
    }


    Listings.findOffersById(listingid, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});





app.get("/listings/likes/", (req, res, next) => {
    var listingid = req.params.id;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(listingid) || listingid.length < 1 || listingid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid ListingID\" }");
        return;
    }


    Listings.findOffersById(listingid, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});


app.post("/listings/:id/offers", (req, res, next) => {
    var fklistingid = req.params.id;
    var offer = req.body.offer;
    var fkofferorid = req.body.fk_offeror_id;

    if (isNaN(offer) || offer < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid offer amount\" }");
        return;
    }

    if (isNaN(fklistingid) || fklistingid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid listing id\" }");
        return;
    }

    if (isNaN(fkofferorid) || fkofferorid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid offer id\" }");
        return;
    }

    Listings.addOffer(offer, fklistingid, fkofferorid, fklistingid, offer, fkofferorid, function (err, result) {
        if (!err) {
            res.status(201);
            res.send(result);
        } else {
            if (err.code == 'ER_NO_REFERENCED_ROW_2') { //This error refers to a foreign key constraint error, which means the ID given is not valid
                res.status(500);
                res.send("{ \"Message\" : \"Listing ID / Offer ID is invalid! (Foreign key constraint failed)\" }");
                return;
            }
            console.log(err);
            res.status(500);
            //res.send(err.statusCode);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        }
    });
});


app.get("/likes", (req, res, next) => {

    Users.likeListing((error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});


app.get("/likes/:id", (req, res, next) => {
    var id = req.params.id;

    Users.likeListingById(id, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});

app.get("/listing/likes/", (req, res, next) => {
    Listings.findAllListingLikes((error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});


app.delete("/unlike/:userid/:listingid", (req, res, next) => {
    var userid = parseInt(req.params.userid);
    var listingid = parseInt(req.params.listingid);


    Users.unlike(userid, listingid, listingid, (error, result) => {
        if (error) {
            console.log(error);
            res.send("{ \"Result\" : \"Internal Error\" }");
            return;
        } else {

            // if (result != 0) {
            // var resultstr = result.toString();
            // }
            if (result != 0) {
                res.status(200).send("{\"Affected Rows\":\"" + result + "\"}");
                console.log("User " + userid + " has unliked post " + listingid);
                return;
            } else {
                res.status(404).send("{ \"Error\" : \"User has not liked the post.\" }");
                return;
            }

        }
    });
});


app.post("/likes", (req, res, next) => {
    var userid = req.body.userid;
    var listingid = req.body.listingid;

    Users.addLike(userid, listingid, userid, listingid, listingid, function (err, result) {
        // if (err.code === "ER_DUP_ENTRY") {
        //     console.log("Listing has already been liked, ER_DUP_ENTRY");
        //     res.status(422);
        //     res.send("{ \"Message\" : \"Username provided already exists\" }");
        //     return;
        // }

        if (!err) {
            res.status(201);
            res.send(result);
        } else {
            console.log(err);
            res.status(500);
            //res.send(err.statusCode);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        }
    });
});

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.body.file;

    //Retrieves the image's location and it's name, then runs a check on it's width and height
    sizeOf('./upload/file-' + /*insert name*/ +'.jpg', function (err, dimensions) {
        if (err) throw err

        console.log("Width: " + dimensions.width, "Height:" + dimensions.height)
    })

    console.log(file);
    if (dimensions.width > 0 && dimensions.height > 0) {
        console.log("Valid File");
    }

    if (file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    console.log("Uploaded");
    res.send(file)

})


app.get('/image/:imageid', function (req, res) {
    var imageid = req.params.imageid;
    //Postmans requires a exact path and to do so, you must add a '__dirname', path.resolve or define the root
    res.sendFile('/upload/file-' + imageid + '.jpg', {
        root: '.'
    });
});


app.post('/user/logout', function (req, res) {
    console.log("..logging out.");
    res.clearCookie('session-id'); //clears the cookie in the response
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        status: 'Log out successful!'
    });

});


app.get("/offers/:userid", (req, res, next) => {
    var userid = req.params.userid;
    //Does a data validation for user id. If it is not valid, send error message and return
    if (isNaN(userid) || userid.length < 1 || userid < 1) {
        res.status(404).send("{ \"Error\" : \"Invalid ListingID\" }");
        return;
    }


    Users.findUserOffers(userid, (error, result) => {
        // if (result.length < 1) {
        //     res.status(404).send("{ \"Error\" : \"No offer with that ID was found\" }");
        //     return;
        // }

        if (error) {
            console.log(error);
            res.status(500);
            res.send("{ \"Message\" : \"Some error occurred\" }");
            return;
        };

        res.status(200).send(result);
    });
});

module.exports = app;