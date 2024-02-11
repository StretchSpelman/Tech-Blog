const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    res.render("login", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/signup", async (req, res) => {
  try {
    res.render("signup", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    res.render("dashboard", {
      logged_in: req.session.logged_in,
      dashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/*", async (req, res) => {
  try {
    res.render("post", {
      logged_in: req.session.logged_in,
      postById: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/home", async (req, res) => {
  try {
    res.render("home", {
      logged_in: req.session.logged_in,
      home: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/create", async (req, res) => {
  try {
    res.render("postForm", {
      logged_in: req.session.logged_in,
      createPost: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;