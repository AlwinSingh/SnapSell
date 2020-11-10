const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendFile("/public/login.html", {
    root: __dirname
  });
});

app.get("/index", (req, res) => {
  res.sendFile("/public/index.html", {
    root: __dirname
  });
});

app.get("/header", (req, res) => {
  res.sendFile("/public/header.html", {
    root: __dirname
  });
});

app.get("/img/face.png", (req, res) => {
  res.sendFile("/public/img/face.png", {
    root: __dirname
  });
});


app.get("/listings", (req, res) => {
  res.sendFile("/public/listings.html", {
    root: __dirname
  });
});

app.get("/search", (req, res) => {
  res.sendFile("/public/search.html", {
    root: __dirname
  });
});

app.get("/createlisting", (req, res) => {
  res.sendFile("/public/createlisting.html", {
    root: __dirname
  });
});

// app.get("/createoffer", (req, res) => {
//   res.sendFile("/public/createoffer.html", {
//     root: __dirname
//   });
// });

app.get("/profile", (req, res) => {
  res.sendFile("/public/profile.html", {
    root: __dirname
  });
});

app.get("/register", (req, res) => {
  res.sendFile("/public/register.html", {
    root: __dirname
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile("/public/dashboard.html", {
    root: __dirname
  });
});


/*
 Alwin Singh
 P1935996
 DIT/FT/1B/01
 BED CA2   
 */

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Client server has started listening on port ${PORT}`);
});