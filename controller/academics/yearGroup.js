const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const YearGroup = require("../../model/Academic/YearGroup");

// @desc createyearGroup
// @route POST/api/yearGroup
// @acess Private
exports.createYearGroup = asyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;
  // check if exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    throw new Error("YearGroup already exists");
  }
  //   create
  const yearGroupcreated = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });

  // push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) {
    throw new Error("Admin Not found");
  }
  admin.yearGroups.push(yearGroupcreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "YearGroup Created Successfully",
    data: yearGroupcreated,
  });
});

// @desc getYearGroups
// @route GET/api/yeargroups
// @acess Private
exports.getYearGroups = asyncHandler(async (req, res) => {
  const yeargroups = await YearGroup.find();
  res.status(201).json({
    status: "success",
    message: "YearGroups fetched Successfully",
    data: yeargroups,
  });
});

// @desc getSingleYearGroup
// @route GET/api/yeargroup/:id
// @acess Private
exports.getSingleYearGroup = asyncHandler(async (req, res) => {
  const yeargroup = await YearGroup.findById(req.params.id);
  if (yeargroup) {
    res.status(201).json({
      status: "success",
      message: "yeargroup fetched Successfully",
      data: yeargroup,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: [],
    });
  }
});

// @desc updateSingleyeargroup
// @route PUT/api/yeargroup/:id
// @acess Private
exports.updateYearGroup = asyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  // check name exists
  const yeargroupFound = await YearGroup.findOne({ name });
  if (yeargroupFound) {
    throw new Error("create yeargroup already exists");
  }

  const yeargroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  // console.log(yeargroup); year group null mean not found

  if (yeargroup != null) {
    res.status(201).json({
      status: "success",
      message: "yeargroup update Successfully",
      data: yeargroup,
    });
  }
  if (yeargroup === null) {
    res.status(201).json({
      status: "success",
      message: "not exists",
      data: [],
    });
  }
  // res.status(201).json({
  //   status: "success",
  //   message: "yeargroup update Successfully",
  //   data: yeargroup,
  // });
});

// @desc deleteSingleYearGroup
// @route DELETE/api/yeargroup/:id
// @acess Private
exports.deleteYearGroup = asyncHandler(async (req, res) => {
  const yeargroup = await YearGroup.findByIdAndDelete(req.params.id);
  console.log(yeargroup);
  if (yeargroup !== null) {
    res.status(201).json({
      status: "success",
      message: "YearGroup delete Successfully",
    });
  } else {
    res.status(201).json({
      status: "success",
      message: "not - exists",
    });
  }
});
