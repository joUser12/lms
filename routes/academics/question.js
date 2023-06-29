const express = require("express");
const {  createQuestion, getQuestions, getSingleQuestion, updateQuestion} = require("../../controller/academics/questionsController");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

const questionRouter = express.Router();
questionRouter.post("/:examID", isTeacherLogin, isTeacher, createQuestion);
questionRouter.get("", isTeacherLogin, isTeacher, getQuestions);
questionRouter.get("/:id", isTeacherLogin, isTeacher, getSingleQuestion);
questionRouter.put("/:id", isTeacherLogin, isTeacher, updateQuestion);
// questionRouter.route("/:examID").post(isTeacherLogin, isTeacher, createQuestion)
// .get(isTeacherLogin, isTeacher, getExams)
// examRouter.route("/:id").get(isTeacherLogin, isTeacher, getSingleExam)
// examRouter.route("/:id").put(isTeacherLogin, isTeacher, updateExam)
module.exports = questionRouter;
