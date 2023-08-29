const asyncHandler = require("express-async-handler");
const ExamResult = require("../../model/Academic/ExamResults");
const Student = require("../../model/Academic/Student");

// @desc Exam results checking
// @route POST/api/exam-results/:id/checking
// @acess Private - Student only

exports.checkExamResult = asyncHandler(async (req, res) => {
// find the student
// req.userAuth?._id
// console.log(req.userAuth?._id);
const studentFound = await Student.find(req.userAuth?.id);

if(!studentFound){
throw new Error ("No student Found");
}

// find the exam results
const examResult =await ExamResult.findOne({
  studentID:studentFound?.studentId,
  _id:req.params.id
});
// check if exam is published
if(examResult?.isPublished === false){
  throw new Error("Exam result is not available ,check out later")
}

res.json({
  status:"success",
  message:"Exam Results",
  data:examResult
})
});

// @desc Get all results (name ,id)
// @route POST/api/exam-results
// @acess Private - Students only

exports.getAllExamResults = asyncHandler(async (req,res)=>{
  const results = await ExamResult.find();
  res.status(200).json({
    status:"success",
    message:"Exam Results",
    data:results
  })
})