const router = require("express").Router();
const { Event, User } = require("../../models");


router.get("/", async (req, res) => {
  try {
    const eventsData = await Event.findAll();
    res.status(200).json(eventsData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get("/event-by-id/:id", async (req, res) => {
  try {
    const eventsData = await Event.findByPk(req.params.id);
    if (!eventsData) {
      res.status(404).json({ message: "No Event Found" });
      return;
    }

    res.status(200).json(eventsData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/user-events", async (req, res) => {
  try {
    const userData = req.session.user_id;
    const allEvents = await Event.findAll({ where: { created_by: userData } });
    res.status(200).json(allEvents);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.status(401).json({ message: "Unauthorized: User not logged in" });
      return;
    }

    const userId = req.session.user_id;

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const eventsData = await Event.create({
      event_name: req.body.event_name,
      event_start: req.body.event_start,
      event_end: req.body.event_end,
      event_location: req.body.event_location,
      event_desc: req.body.event_desc,
      created_by: userId,
    });
    res.status(200).json(eventsData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const eventData = await Event.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!eventData) {
      res.status(404).json({ message: "Event does not exist" });
    }

    res.status(200).json(eventData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
