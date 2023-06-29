const express = require("express");
const { adminRegisterStudent,studentLogin, getStudentProfile, getAllStudent, getStudentById, studentUpdateProfile, adminUpdateStudent, writeExam } = require("../../controller/student/studentController");
const studentRouter = express.Router();


const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isSudentLogin");

studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);
studentRouter.post("/login", studentLogin);
studentRouter.get("/profile",isStudentLogin,isStudent, getStudentProfile);
studentRouter.get("/admin",isLogin,isAdmin, getAllStudent);
studentRouter.get("/:studentId/admin", isLogin, isAdmin, getStudentById);
studentRouter.put("/:studentId/update", isStudentLogin, isStudent, studentUpdateProfile);
studentRouter.put("/:studentId/update/admin",isLogin,isAdmin, adminUpdateStudent);


studentRouter.post("/exam/:examID/write", isStudentLogin, isStudent, writeExam);



module.exports = studentRouter;
