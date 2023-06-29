const express = require("express");

const teacherRouter = express.Router();
const {
  adminRegisterTeacher,
  teacherLogin,
  getAllTeacher,
  getTeacherById,
  getTeacherProfile,
  teacherUpdateProfile,
  adminUpdateTeacherProfile
} = require("../../controller/Staff/teacherController");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
// admin register

teacherRouter.post("/admin/register", isLogin, isAdmin, adminRegisterTeacher);
teacherRouter.post("/login", teacherLogin);
teacherRouter.get("/admin", isLogin, isAdmin, getAllTeacher);
teacherRouter.get("/admin", isLogin, isAdmin, getAllTeacher);
teacherRouter.get("/:teacherID/admin", isLogin, isAdmin, getTeacherById);
teacherRouter.get("/profile", isTeacherLogin, isTeacher, getTeacherProfile);
teacherRouter.put("/:teacherID/update", isTeacherLogin, isTeacher,teacherUpdateProfile );
teacherRouter.put("/:teacherID/update/admin", isLogin, isAdmin,adminUpdateTeacherProfile );
module.exports = teacherRouter;
