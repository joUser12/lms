const Student = require("../model/Academic/Student");
const isStudent = async (req, res, next) => {
  console.log(req.userAuth);
  // find the user
  const userId = req.userAuth?._id;
  const studentFound = await Student.findById(userId);
  // check Student
  if (studentFound?.role === "student") {
    next();
  } else {
    next(new Error("Access Denied,student only"));
  }
};

module.exports = isStudent;
