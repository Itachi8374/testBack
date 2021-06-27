const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { Meeting } = require("../models/meeting");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

router.post("/user", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});

router.post("/meeting", async (req, res) => {
  const { error } = validateMeeting(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let meeting = await Meeting.findOne({ id: req.body.id });
  if (!meeting) return res.status(400).send("Invalid meeting id");

  const validPassword = req.body.password == meeting.password;
  if (!validPassword) return res.status(400).send("Invalid password");
  const token = meeting.generateAuthToken();
  res.send(token);
});

function validateUser(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

function validateMeeting(meeting) {
  const schema = Joi.object({
    id: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(meeting);
}

module.exports = router;
