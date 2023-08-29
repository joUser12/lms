const express = require("express");
const { checkExamResult ,getAllExamResults} = require("../../controller/academics/examResultController");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isSudentLogin");
const examResults = express.Router(); 
examResults.get("/",getAllExamResults)
examResults.get("/:id/checking",checkExamResult)

module.exports = examResults; 