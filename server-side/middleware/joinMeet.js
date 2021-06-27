const jwt = require("jsonwebtoken");

function joinMeet(req, res, next) {
  const token = req.header("x-meet-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, "jwtPrivateKey");
    req.meeting = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = joinMeet;
