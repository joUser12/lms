const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");

// @desc createsubject
// @route POST/api/subject/:programID
// @acess Private
exports.createSubject = asyncHandler(async (req, res) => {
  // console.log(req.params.programID);
  const { name, description, academicTerm } = req.body;
  // if the program
  const programFound = await Program.findById(req.params.programID);
  console.log(programFound);
  if (!programFound) {
    throw new Error("program not found");
  }
  // check if exists
  const subjectFound = await Subject.findOne({ name }); 
  if (subjectFound) {
    throw new Error("Subject already exists");
  }
  //   create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });

  // // push program into admin
  // const admin = await Admin.findById(req.userAuth._id);
  // admin.programs.push(subjectCreated._id);
  // await admin.save();

  // push to the program
  programFound.subjects.push(subjectCreated._id);
  // save
  await programFound.save();

  res.status(201).json({
    status: "success",
    message: "Subject Created Successfully",
    data: subjectCreated,
  });
});

// @desc getsubjects
// @route GET/api/subject
// @acess Private
exports.getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  res.status(201).json({
    status: "success",
    message: "subject fetched Successfully",
    data: subjects,
  });
});

// @desc getSingleSubject
// @route GET/api/Subject/:id
// @acess Private
exports.getSingleSubject= asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (subject ) {
    res.status(201).json({
      status: "success",
      message: "subject fetched Successfully",
      data: subject,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: null,
    });
  }
});

// @desc updateSinglesubject
// @route PUT/api/subject/:id
// @acess Private
exports.updateSubject = asyncHandler(async (req, res) => {
  const { name, description,academicTerm } = req.body;

  // check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("create subject already exists");
  }

  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "subject update Successfully",
    data: subject,
  });
});

// @desc deleteSinglesubject
// @route DELETE/api/subject/:id
// @acess Private
exports.deleteSubject = asyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "subject delete Successfully",
  });
});
