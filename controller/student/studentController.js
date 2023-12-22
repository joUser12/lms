const Student = require("../../model/Academic/Student");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");
const nodemailer = require('nodemailer');
const { hashPassword, isPassMatch } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
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
  let image = "https://t3.ftcdn.net/jpg/03/01/24/58/240_F_301245840_zwJpFB1MCmJkTg1tMDK9pFnCwce6dQ1T.jpg"
  // send student data
  res.status(201).json({
    status: "success",
    message: "Student registered Successfully",
    data: studentCreated,
  });

  if (!student) {
    // Create the email message
    const mailOptions = {
      from: 'joysundaran@gmail.com',
      to: email,
      subject: 'Welcome to the Learning Platform!',
      html: `
          <h2>Dear ${name},</h2>
          <p>Congratulations! Your registration on the Learning Platform was successful. Welcome to our vibrant learning community.</p>
          <p>We are thrilled to have you on board and look forward to supporting you on your learning journey.</p>
          <p style="text-align: center;"><img src="${image}" alt="Welcome Image"></p>
          <p>Feel free to explore our platform and take advantage of the resources we offer. If you have any questions or need assistance, don't hesitate to reach out.</p>
          <p>Happy learning!</p>
      `
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Registration email sent');
      }
    });
  }
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
    student.token = generateToken(student._id)
    const { password, ...responseStudent } = student._doc;
    res.status(200).json({
      status: "success",
      message: "student logged in successfully",
      data: responseStudent
    });
  }
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
  console.log(req.body);
  const { email, name, password,imageUrl } = req.body;
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
        imageUrl
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
  const { program, classLevels, academicYear, email, name, prefectName, isSuspended, isWithdrawn } = req.body;
  //   find the student by id
  const studentFound = await Student.findById(req.params.studentId);
  if (!studentFound) {
    throw new Error("student not found");
  }
  // update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentId, {
    $set: {
      name,
      email,
      academicYear,
      program,
      prefectName,
      isSuspended,
      isWithdrawn
    },
    $addToSet: {
      classLevels
    },
  },
    {
      new: true,
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
  if (!studentFound)
    throw new Error('Student not found');

  // get Exam
  const examFound = await Exam.findById(req.params.examID).populate("questions").populate("academicTerm")

  if (!examFound)
    throw new Error('exam not found');

  // get questions
  const questions = examFound?.questions;

  // get students question
  const studentAnswer = req.body.answer;



  // build report object
  let correctAnswer = 0;
  let wrongAnswer = 0;
  let totalQuestion = 0;
  let grade = 0;
  let score = 0;
  let status;
  let remarks;
  let unAnsweredQuestions = 0;
  let answeredQuestions = [];

  // check user attempted all question - not need 
  if (studentAnswer.length != questions.length)
    throw new Error('you not answser all questions');

  // check  if student has  already take exam
  // const studentFoundResults = await ExamResult.findById(studentFound?._id);
  const studentFoundResults = await ExamResult.findOne({ student: studentFound?._id });
  if (studentFoundResults) {
    throw new Error('You have already wriiten this exam');
  }

  // check  if student is suspended/withdrawn
  if (studentFound.isWithdrawn || studentFound.isSuspended) {
    throw new Error('You are suspended  you canit take the exam');
  }

  // check for answer
  for (let i = 0; i < questions.length; i++) {
    // find the question
    const question = questions[i];
    // check if question 
    // console.log(studentAnswer);
    if (studentAnswer[i] != '') {
      console.log(studentAnswer[2]);
      if (question.correctAnswer === studentAnswer[i]) {
        correctAnswer++;
        score++;
        question.isCorrect = true;
      } else {
        wrongAnswer++;
      }
    } else {
      unAnsweredQuestions++;
    }
  }

  // calculate report 
  totalQuestion = questions.length;
  grade = (correctAnswer / totalQuestion) * 100;
  answeredQuestions = questions.map(question => {
    return {
      question: question.question,
      correctanser: question.correctAnswer,
      isCorrect: question.isCorrect
    }
  })
  // calculate status
  if (grade >= 50)
    status = 'passed'
  else
    status = 'failed'
  // calculate remoark
  if (grade >= 80)
    remarks = 'Excellant'
  else if (grade >= 70)
    remarks = 'Very good'
  else if (grade >= 60)
    remarks = 'Good'
  else if (grade >= 50)
    remarks = 'Fair'
  else
    remarks = 'poor'

  // genearate Exam Results

  const examResults = await ExamResult.create({
    studentID: studentFound?.studentId,
    exam: examFound?.id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound?.classLevel,
    academicTerm: examFound?.academicTerm,
    academicYear: examFound?.academicYear
  })

  // // push the result into
  // studentFound.examResults.push(examResults?._id);
  // // save
  // await studentFound.save();



  // promote level 200
  if (examFound.academicTerm.name === '2 -term' &&
    status === 'passed' && studentFound?.currentClassLevel === "level 100"
  ) {
    studentFound.classLevels.push('level 200');
    studentFound.currentClassLevel = 'level 200'
    studentFound.save();
  }

  // promote level 300
  if (examFound.academicTerm.name === '2 -term' &&
    status === 'passed' && studentFound?.currentClassLevel === "level 200"
  ) {
    studentFound.classLevels.push('level 300');
    studentFound.currentClassLevel = 'level 300'
    studentFound.save();
  }

  // promote level 400
  if (examFound.academicTerm.name === '2 -term' &&
    status === 'passed' && studentFound?.currentClassLevel === "level 300"
  ) {
    studentFound.classLevels.push('level 400');
    studentFound.currentClassLevel = 'level 400'
    studentFound.save();
  }

  // promote student to graduate 

  if (examFound.academicTerm.name === '2 -term' &&
    status === 'passed' && studentFound?.currentClassLevel === "level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date;
    studentFound.save();
  }

  // res.status(200).json({
  //   // status:"success",
  //   studentFound,
  //   totalQuestion,
  //   correctanswer:correctAnswer,
  //  scoremark:score,
  //  grade,
  //  status,
  //  remarks,
  //  wronganser:wrongAnswer,
  //  unanswer:unAnsweredQuestions,
  //  answeredQuestions,
  // //  examResults
  // })

  res.status(200).json({
    status: "success",
    data: "you have submitted your exam . check later for the results"

  })

});
