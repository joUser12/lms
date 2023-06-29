const asyncHandler = require("express-async-handler");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");

// @desc createAcadmicYear
// @route POST/api/academic-years
// @acess Private
exports.createAcademicYear = asyncHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;
  // check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) {
    throw new Error("Academic year already exists");
  }
  //   create
  const academicYearcreated = await AcademicYear.create({
    name,
    fromYear,
    toYear,
    createdBy: req.userAuth._id,
  });

  // push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicYears.push(academicYearcreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Academic Year Created Successfully",
    data: academicYearcreated,
  });
});

// @desc getAcademicYears
// @route GET/api/academic-years
// @acess Private
exports.getAcademicYears = asyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.find();
  res.status(201).json({
    status: "success",
    message: "Academic Year fetched Successfully",
    data: academicYears,
  });
});

// @desc getSingleAcademicYear
// @route GET/api/academic-years
// @acess Private
exports.getSingleAcademicYear = asyncHandler(async (req, res) => {
  const academicYear = await AcademicYear.findById(req.params.id);
  if (academicYear) {
    res.status(201).json({
      status: "success",
      message: "Academic Year fetched Successfully",
      data: academicYear,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: null,
    });
  }
});

// @desc updateSingleAcademicYear
// @route PUT/api/academic-years
// @acess Private
exports.updateAcademicYear = asyncHandler(async (req, res) => {
  const { name, fromYear, toYear } = req.body;

  // check name exists
  const createAcademicYearFound = await AcademicYear.findOne({ name });
  if (createAcademicYearFound) {
    throw new Error("Academic year already exists");
  }

  const academicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    {
      name,
      fromYear,
      toYear,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "Academic Year update Successfully",
    data: academicYear,
  });
});

// @desc deleteSingleAcademicYear
// @route PUT/api/academic-years
// @acess Private
exports.deleteAcademicYear = asyncHandler(async (req, res) => {
  await AcademicYear.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Academic Year delete Successfully",
  });
});
