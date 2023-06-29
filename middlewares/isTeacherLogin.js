const Teacher = require("../model/Staff/Teacher");
const verifyToken = require("../utils/verifyToken");
const isTeacherLogin = async (req, res, next) => {
  // get token from header

  const headerObj = req.headers;
  const token =
    headerObj &&
    headerObj.authorization &&
    headerObj.authorization.split(" ")[1];
  // verify token
  const verifiedToken = verifyToken(token);

  if (verifiedToken) {
    // find the user
    const user = await Teacher.findById(verifiedToken.id);
    // const user = await Teacher.findById(verifiedToken.id).select("name email role")
    req.userAuth = user;
    next();
  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
};

module.exports = isTeacherLogin;