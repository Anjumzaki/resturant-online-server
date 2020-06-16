var createError = require("http-errors");
var express = require("express");
var path = require("path");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");

const Restaurent = require("./models/Restaurent");
const InviteCode = require("./models/InviteCode");
const passport = require("passport");
var app = express();
const users = require("./routes/auth");
var favicon = require("serve-favicon");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

var cors = require("cors");

app.use(cors());
//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "1000kb" }));

//DB config
const db = require("./config/keys").mongoURI;
//connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use("/api/users", users);

//post store
app.post("/add/restaurent", async (req, res) => {
  console.log(req.body);
  let restaurent = new Restaurent({
    name: req.body.name,
    category: req.body.category,
    phoneNumber: req.body.phoneNumber,
    stempPrice: req.body.stempPrice,
    inviteCode: req.body.inviteCode,
    description: req.body.description,
    address: req.body.address,
    userId: req.body.userId,
    lat: req.body.lat,
    lng: req.body.lng,
  });

  restaurent.save(function (err) {
    if (err) {
      console.error(err);
      res.status(200).send({
        success: "false",
        message: "restaurent not post",
        restaurent,
      });
    } else {
      res.status(200).send({
        success: "true",
        message: "restaurent post",
        restaurent,
      });
    }
  });
});

//get inviteCode
app.get("/get/inviteCode/:code", (req, res) => {
  if (req.params.code == "123456") {
    res.json(req.params.code);
  } else {
    res.status(404).json(err);
  }
  // InviteCode.findOne({inviteCode: req.params.code})
  // .then(cod => {
  //   res.json(cod);
  // })
  // .catch(err => res.status(404).json(err));
});

//get all stores
app.get("/get/restaurent/", (req, res) => {
  Restaurent.find({})
    .then((restaurent) => {
      res.json(restaurent);
    })
    .catch((err) => res.status(404).json(err));
});

//get all stores
app.get("/get/restaurent/:id", (req, res) => {
  Restaurent.findOne({ userId: req.params.id })
    .then((restaurent) => {
      res.json(restaurent);
    })
    .catch((err) => res.status(404).json(err));
});

//edit store by id
app.put("/edit/user/:id/:count", async (req, res) => {
  console.log("m", req.params);
  User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        scanCount: req.params.count,
      },
    },
    { upsert: true },
    function (err, user) {
      res.status(200).send({
        success: "true",
        message: "user updated",
      });
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;
