const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");

// @desc createprogram
// @route POST/api/program
// @acess Private
exports.createProgram = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  // check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("program already exists");
  }
  //   create
  const programcreated = await Program.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  // push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programcreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "program Created Successfully",
    data: programcreated,
  });
});

// @desc getprograms
// @route GET/api/programs
// @acess Private
exports.getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find();
  res.status(201).json({
    status: "success",
    message: "program fetched Successfully",
    data: programs,
  });
});

// @desc getSingleprogram
// @route GET/api/program/:id
// @acess Private
exports.getSingleProgram = asyncHandler(async (req, res) => { 
  const program = await Program.findById(req.params.id);
  if (program) {
    res.status(201).json({
      status: "success",
      message: "Program fetched Successfully",
      data: program,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: null,
    });
  }
});

// @desc updateSingleProgram
// @route PUT/api/Program/:id
// @acess Private
exports.updateProgram= asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // check name exists
  const createProgramFound = await Program.findOne({ name });
  if (createProgramFound) {
    throw new Error("create Program already exists");
  }

  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "Program update Successfully",
    data: program,
  });
});

// @desc deleteSingleProgram
// @route DELETE/api/Program/:id
// @acess Private
exports.deleteProgram = asyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Program delete Successfully",
  });
});
