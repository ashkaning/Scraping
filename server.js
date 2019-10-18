var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes

/* app.get("/api/fetch", function(req, res) {
  axios.get("https://promotionla.com/blog").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h2.title-container").each(function(i, element) {

      var title = $(element).find('a').text();
      var link = $(element).find("a").attr("href");
        results.push({
        title: title,
        link: link
      });
      console.log("this is it"+results)

      db.Article.create(result)
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        console.log(err);
      });
    }); 

    // Send a message to the client
    res.send("Scrape Complete");
  });
});*/

app.get("/api/fetch", (request, response) => {
  const url = "https://promotionla.com/blog/"
  // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  axios.get(url).then(function (response) {
      var $ = cheerio.load(response.data);
      $("div.quasar-title-date-container").each(function (i, element) {
          let link = $(element).children(".large-9").children(".post-title").children("a").attr("href");
          let title = $(element).children(".large-9").children(".post-title").children("a").text()
          let author = $(element).children(".large-9").children(".entry-meta").children(".author").children("a").text()

          let article = {
              title: title,
              link: link,
              author: author,
              saved: false
          }
          console.log(article);
          db.Article.find({ link: article.link })
              .then(foundArticle => {
                  if (!foundArticle.length) {
                      db.Article.create(article)
                          .catch(error => console.log(error));
                  }
              })
              .catch(error => console.log(error));
      });
      console.log("Scrape complete.");
  })
})
app.put("/api/headlines/:id", function(req, res) {
  //console.log("---------"+req.body.id)
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(updatedArticle=>{
    
    console.log("==========="+updatedArticle)
    res.render('index')
  }).catch(err=>console.log(err))
});


app.get("/saved", function(req, res) {
  db.Article.find({}).then(allSavedArticles=>{
    var handlebarsObject = {
      articles: allSavedArticles
  }
  res.render("saved", handlebarsObject);
  })
});
app.get("/", function(req, res) {
  db.Article.find({}).then(allArticles=>{
    var handlebarsObject = {
      articles: allArticles
  }
  res.render("index", handlebarsObject);
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
