const express = require("express");
const { createExam, getExams, getSingleExam, updateExam } = require("../../controller/academics/examController");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

const examRouter = express.Router();

examRouter.route("/").post(isTeacherLogin, isTeacher, createExam).get(isTeacherLogin, isTeacher, getExams)
examRouter.route("/:id").get(isTeacherLogin, isTeacher, getSingleExam)
examRouter.route("/:id").put(isTeacherLogin, isTeacher, updateExam)
module.exports = examRouter;
