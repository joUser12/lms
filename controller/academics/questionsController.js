const asyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const Question = require("../../model/Academic/Questions");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const Exam = require("../../model/Academic/Exam");

// @desc createQuestion
// @route POST/api/question
// @acess Private teacher only

exports.createQuestion = asyncHandler(async (req, res) => {
    const {question,optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        createdBy
    } = req.body;
  
    // find the  exam 
    const examFound = await Exam.findById(req.params.examID);
    // check if question
    const questionExists = await Question.findOne({question});

    if(questionExists){
      throw new Error("question already exists");
    }
    if (!examFound) {
      throw new Error("exam not found");
    };

    const questionCreated = await   Question.create({
      question,
      optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        createdBy:req.userAuth?._id
    });
// add question into exam
    examFound.questions.push(questionCreated?._id);
    // save

   await  examFound.save()
  
    res.status(201).json({
      status: "success",
      message: "question Created Successfully",
      data: questionCreated,
    });
  });

  // @desc getQuestions
// @route GET/api/questions
// @acess Private techer only
exports.getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find();

  res.status(201).json({
    status: "success",
    message: "questions fetched Successfully",
    data: questions,
  });
});

// @desc getSinglequestions
// @route GET/api/question/:id
// @acess Private teacher only
exports.getSingleQuestion = asyncHandler(async (req, res) => { 
  const question = await Question.findById(req.params?.id);
  if (question) {
    res.status(201).json({
      status: "success",
      message: "question fetched Successfully",
      data: question,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: null,
    });
  }
});

// @desc updateSinglequestions
// @route PUT/api/questions/:id
// @acess Private
exports.updateQuestion= asyncHandler(async (req, res) => {
  const {
    question,optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy
} = req.body;

  const qustionFound = await Question.findOne({ question });
  if (qustionFound) {
    throw new Error(" question already exists");
  }

  const questionupdate = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "question update Successfully",
    data: questionupdate,
  });
});