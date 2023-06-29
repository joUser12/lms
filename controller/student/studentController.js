const Student = require("../../model/Academic/Student");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");

const { hashPassword, isPassMatch } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
// @desc Register student
// @route POST/api/student/admins/register
// @acess Private admin only
  exports.adminRegisterStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    // check if teacher already exists
    const student = await Student.findOne({ email });
  
    if (student) {
      throw new Error("student already employed");
    }
    // create
    const studentCreated = await Student.create({
      name,
      email,
      password: await hashPassword(password, 10),
    });
    console.log(studentCreated);
    // send student data
    res.status(201).json({
      status: "success",
      message: "Student registered Successfully",
      data: studentCreated,
    });
  });


  // @desc  student login
// @route POST/api/student/login
// @acess Private

exports.studentLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // find the student
    const student = await Student.findOne({ email });
    if (!student) {
      return res, json({ message: "Invalid login credentials" });
    }
    //   verify password
    const isMatched = await isPassMatch(password, student.password);
    if (!isMatched) {
      return res.json({ message: "Invalid login credentials" });
    } else {
        student.token =  generateToken(student._id)
      res.status(200).json({
        status: "success",
        message: "student logged in successfully",
        data:  student
        
      });
    }
    // send student data
    res.status(201).json({
      status: "success",
      message: "Teacher registered Successfully",
      data: student,
    });
  });

  // @desc  Getstudent profile
// @route POST/api/student/profile
// @acess Private student only

exports.getStudentProfile = asyncHandler(async (req, res) => {
    console.log(req.userAuth);
    const student = await Student.findById(req.userAuth?._id).select(
      "-password -createdAt -updatedAt"
    );
    if (!student) {
      throw new Error("student not found");
    }
    res.status(200).json({
      status: "success",
      message: "student  profile fetched successfully",
      data: student,
    });
  });


  // @desc  GetAll student  admin
// @route POST/api/student/admin
// @acess Private admin only

exports.getAllStudent = asyncHandler(async (req, res) => {
    const student = await Student.find().select("-password");
    res.status(200).json({
      status: "success",
      message: "student fetched successfully",
      data: student,
    });
  });

  // @desc  GetSinglestudent admin
// @route POST/api/student/admin
// @acess Private admin only

exports.getStudentById = asyncHandler(async (req, res) => {
    console.log(req.params);
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("student not found");
    }
    res.status(200).json({
      status: "success",
      message: "student fetched successfully",
      data: student,
    });
  });

  // @desc  update student
// @route PUT/api/student/:id/update
// @acess Private
exports.studentUpdateProfile = asyncHandler(async (req, res) => {
    console.log(req.userAuth._id);
    const { email, name, password } = req.body;
    // if email is taken
    const emailExist = await Student.findOne({ email });
    if (emailExist) {
      throw new Error("this is email exist/taken");
    }
    if (password) {
      const student = await Student.findByIdAndUpdate(
        req.userAuth._id,
        {
          email,
          password: await hashPassword(password),
          name,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: student,
        message: "student updated sucessfully",
      });
    } else {
      const student = await Student.findByIdAndUpdate(
        req.userAuth._id,
        {
          email,
          name,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: student,
        message: "student updated sucessfully",
      });
    }
  });



  // @desc admin  update student   ---programs class
// @route PUT/api/student/:id/update
// @acess Privateadmin only
exports.adminUpdateStudent = asyncHandler(async (req, res) => {
    const { program, classLevels, academicYear, email,name,prefectName } = req.body;
//   find the student by id
    const studentFound = await Student.findById(req.params.studentId);
    if (!studentFound) {
      throw new Error("student not found");
    }
    // update
    const studentUpdated = await Student.findByIdAndUpdate(
        req.params.studentId,{
            $set:{
                name,
                email,
                academicYear,
                program,
                prefectName
            },
            $addToSet:{
                classLevels
            },
        },
        {
            new :true,
        }
    )
    res.status(200).json({
      status: "success",
      data: studentUpdated,
      message: "studentupdated sucessfully",
    });
  });


  // @desc write exam
// @route POST/api/v1/students/exam/:examID:write
// @acess Private student pnly
exports.writeExam = asyncHandler(async (req, res) => {
// get Student
const studentFound = await Student.findById(req.userAuth?._id);
if(!studentFound)
throw new Error('Student not found');

// get Exam
const examFound = await Exam.findById(req.params.examID).populate("questions")

if(!examFound)
throw new Error('exam not found');

// get questions
const questions = examFound?.questions;

// get students question
const studentAnswer= req.body.answer;



// build report object
let correctAnswer =0;
let wrongAnswer =0;
let totalQuestion =0;
let grade =0;
let score =0;
let status;
let remarks;
let unAnsweredQuestions =0;
let answeredQuestions =[];

// check user attempted all question - not need 
// if(studentAnswer.length != questions.length)
// throw new Error('you not answser all questions');

// check  if student has  already take exam
// const studentFoundResults = await ExamResult.findById(studentFound?._id);
const studentFoundResults = await ExamResult.findOne({student:studentFound?._id});
if(studentFoundResults){
  throw new Error('You have already wriiten this exam');
}
 

// check for answer
for (let i=0;i<questions.length ;i++){
  // find the question
  const question = questions[i];
  // check if question 
  // console.log(studentAnswer);
  if(studentAnswer[i] !=''){
    console.log(studentAnswer[2]);
    if(question.correctAnswer === studentAnswer[i]){
      correctAnswer++;
      score++;
      question.isCorrect =true;
    }else{
      wrongAnswer++;
    }
  }else{
    unAnsweredQuestions++;
  }
}

// calculate report 
totalQuestion = questions.length;
grade =(correctAnswer/totalQuestion)*100;
answeredQuestions = questions.map(question=>{
  return{
    question:question.question,
    correctanser:question.correctAnswer,
    isCorrect:question.isCorrect
  }
})
// calculate status
if(grade>=50)
  status = 'passed'
  else
  status='failed'
// calculate remoark
if(grade>=80)
remarks= 'Excellant'
else if(grade>=70)
remarks= 'Very good'
else if(grade>=60)
remarks= 'Good'
else if(grade>=50)
remarks= 'Fair'
else 
remarks= 'poor'

// genearate Exam Results

const examResults = await ExamResult.create({
  student:studentFound?._id,
  exam:examFound?.id,
  grade,
  score,
  status,
  remarks,
  classLevel:examFound?.classLevel,
  academicTerm:examFound?.academicTerm,
  academicYear:examFound?.academicYear
})

// push the result into
studentFound.examResults.push(examResults?._id);

// save
await studentFound.save();

res.status(200).json({
  // status:"success",
  totalQuestion,
  correctanswer:correctAnswer,
 scoremark:score,
 grade,
 status,
 remarks,
 wronganser:wrongAnswer,
 unanswer:unAnsweredQuestions,
 answeredQuestions,
 examResults
})

});
  