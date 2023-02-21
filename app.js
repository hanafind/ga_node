var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const config = require(`./config/${process.env.NODE_ENV}.json`);
const pg = require("pg");
const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);
const pgPool = new pg.Pool(config.postgresql);

var indexRouter = require("./routes/index");
var blogRouter = require("./routes/blog");
var csRouter = require("./routes/cs");

var app = express();

// view engine setup
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/pages"),
  path.join(__dirname, "views/layout"),
  path.join(__dirname, "views/modal"),
]);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/blog", blogRouter);
app.use("/cs", csRouter);
app.use("/uploads", express.static(config.blog.upload_path));

app.use(
  expressSession({
    store: new pgSession({
      pool: pgPool, // Connection pool
      schemaName: "session",
      tableName: "user_sessions", // Use another table-name than the default "session" one
      // Insert connect-pg-simple options here
    }),
    secret: "hanafind2023blog!@#$",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    // Insert express-session options here
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
