const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

meetingSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, id: this.id, name: this.name },
    "jwtPrivateKey"
  );
  return token;
};

const Meeting = mongoose.model("Meeting", meetingSchema);

function validateMeeting(meeting) {
  const schema = Joi.object({
    id: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    name: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(meeting);
}

exports.Meeting = Meeting;
exports.validate = validateMeeting;
