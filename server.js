// ---npm Packages---
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

// -----Middleware--

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });


// ---ROUTES--

app.get("/scrape", function(req, res) {
    axios.get("https://iccinternational.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $("h1").each(function(i, element) {
            var result = {};
            result.link = $(this)
        .children("a")
        .attr("href");
        
        db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
            return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/summary", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });