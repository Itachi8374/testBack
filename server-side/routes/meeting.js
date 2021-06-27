const auth = require("../middleware/auth");
const _ = require("lodash");
const { Meeting, validate } = require("../models/meeting");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  let meetings = await Meeting.find({ email: req.user.email });
  res.send(meetings);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let meeting = await Meeting.findOne({ id: req.body.id });
  let host = await User.findOne({ email: req.body.email });
  if (meeting)
    return res.status(400).send("Meeting already registered with this id");
  if (!host) return res.status(400).send("Invalid hostname");
  meeting = new Meeting(_.pick(req.body, ["id", "email", "name", "password"]));
  await meeting.save();

  res.send(_.pick(meeting, ["_id", "id", "name"]));
});

router.delete("/:id", auth, async (req, res) => {
  const result = await Meeting.deleteOne({ id: req.params.id });
  res.send(result);
});

module.exports = router;
