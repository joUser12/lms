const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
// @desc createAcadmicTerm
// @route POST/api/academic-terms
// @acess Private
exports.createAcademicTerm = asyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  // check if exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    throw new Error("Academic Term already exists");
  }
  //   create
  const academicTermcreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: req.userAuth._id,
  });

  // push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicTerms.push(academicTermcreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic Term Created Successfully",
    data: academicTermcreated,
  });
});

// @desc getAcademicYears
// @route GET/api/academic-terms
// @acess Private
exports.getAcademicTerms = asyncHandler(async (req, res) => {
  const academicTerms = await AcademicTerm.find();
  res.status(201).json({
    status: "success",
    message: "Academic Terms fetched Successfully",
    data: academicTerms,
  });
});

// @desc getSingleAcademicYear
// @route GET/api/academic-terms/:id
// @acess Private
exports.getSingleAcademicTerm = asyncHandler(async (req, res) => {
  const academicTerm = await AcademicTerm.findById(req.params.id);
  if (academicTerm) {
    res.status(201).json({
      status: "success",
      message: "Academic Term fetched Successfully",
      data: academicTerm,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: null,
    });
  }
});

// @desc updateSingleAcademicTerm
// @route PUT/api/academic-terms/:id
// @acess Private
exports.updateAcademicTerm = asyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  // check name exists
  const createAcademicTermFound = await AcademicTerm.findOne({ name });
  if (createAcademicTermFound) {
    throw new Error("Academic term already exists");
  }

  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "Academic Term update Successfully",
    data: academicTerm,
  });
});

// @desc deleteSingleAcademicTerm
// @route PUT/api/academic-terms/:id
// @acess Private
exports.deleteAcademicTerm = asyncHandler(async (req, res) => {
  await AcademicTerm.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Academic Term delete Successfully",
  });
});
