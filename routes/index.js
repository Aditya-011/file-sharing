// Full Documentation - https://docs.turbo360.co
const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("index.ejs");
});
/*  This route render json data */
router.get("/json", (req, res) => {
  res.json({
    confirmation: "success",
    app: process.env.TURBO_APP_ID,
    data: "this is a sample json route.",
  });
});
router.use("/files", require("./show"));
router.use("/api/files", require("./api"));
/*  This route sends text back as plain text. */
router.get("/send", (req, res) => {
  res.send("This is the Send Route");
});

/*  This route redirects requests to Turbo360. */
router.get("/redirect", (req, res) => {
  res.redirect("https://www.turbo360.co/landing");
});

module.exports = router;
