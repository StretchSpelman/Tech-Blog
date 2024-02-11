const router = require("express").Router();
const { User } = require("../../models");
const { Op } = require("sequelize");

router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });

    req.session.save(() => {
      req.session.logged_in = true;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email || "" },
          { username: req.body.username || "" },
        ],
      },
    });
    console.log(userData)
    if (!userData) {
      res.status(400).json({ message: "Incorrect email or password" });
      console.log("bad")
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect email or password" });
      console.log("wrong")
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.json({
        message: "You are now logged in!",
        user_id: req.session.user_id,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get("/name/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (!userData) {
      res.status(404).json({ message: "User not found" }).end();
    }
    res.status(200).json(userData.name);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;