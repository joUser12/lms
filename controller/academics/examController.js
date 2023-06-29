const asyncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");

// @desc createExam
// @route POST/api/exam
// @acess Private

exports.createExam = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    passMark,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    academicYear,
    classLevel,
    examStatus,
  } = req.body;

  // find teacher
  const teacherFound = await Teacher.findById(req.userAuth._id);

  if (!teacherFound) {
    throw new Error("exam not found");
  }

  // exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    // throw new Error("exam exist found");
    res.status(200).json({
      status: "success",
      message: "exam already  exist found",
    });
  }

  // create
  const examCreated = await new Exam({
    name,
    description,
    subject,
    program,
    passMark,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    classLevel,
    createdBy: req.userAuth?._id,
    examStatus,
    academicYear,
  });
  //   push the exam in teacher
  teacherFound.examsCreated.push(examCreated);

  // save exam
  await examCreated.save();
  await teacherFound.save();
  res.status(201).json({
    status: "success",
    message: "Exam Created Successfully",
    data: examCreated,
  });
});

// @desc getexams
// @route GET/api/programs
// @acess Private
exports.getExams = asyncHandler(async (req, res) => {
  // const exams = await Exam.find().populate('questions');
  const exams = await Exam.find().populate({path:"questions",
  populate:{
    path:"createdBy"
  }

});
  res.status(201).json({
    status: "success",
    message: "exams fetched Successfully",
    data: exams,
  });
});

// @desc getSingleExam
// @route GET/api/exams/:id
// @acess Private teacher only
exports.getSingleExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Exam fetched Successfully",
    data: exam,
  });
});

// @desc updateexam
// @route PUT/api/exam/:id
// @acess Private
exports.updateExam = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    passMark,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    academicYear,
    classLevel,
    examStatus,
  } = req.body;

  // check name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error("create exam already exists");
  }

  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      passMark,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      createdBy,
      academicYear,
      classLevel,
      examStatus,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "exam update Successfully",
    data: exam,
  });
});
