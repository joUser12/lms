const Admin = require("../../model/Staff/Admin");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const { hashPassword, isPassMatch } = require("../../utils/helpers");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
// @desc Register admin
// @route POST/api/admins/register
// @acess Private
exports.registerAdminCtrl = asyncHandler(async (req, res) => {
  const { name, email, password ,phoneNumber} = req.body;

   
  
  
  // check if user exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    res.json("admin exists");
  }
  // // password hash
  // const salt = await bcrypt.genSalt(10);
  // const passwordhased = await bcrypt.hash(password, salt);
  const user = await Admin.create({
    name,
    email,
    phoneNumber,
    // password: await hashPassword(password),
    password: await hashPassword(password, 10),
  });
if(!adminFound){

   // Create the email message
   const mailOptions = {
    from: 'joysundaran15@gmail.com',
    to: email,
    // subject: 'Registration Confirmation',
    subject: 'Welcome to learning Platform!',
    // text: `Dear ${name},\n\nThank you for registering on our website.`
    html: `
    <h2>Dear ${name},</h2>
    <p>Thank you for registering on learning Platform! We are excited to have you as part of our learning community.</p>
  `
  };
  console.log("dfdf");
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


    // sms register user
    const accountSid = process.env.YOUR_ACCOUNT_SID;
const authToken = process.env.YOUR_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const registeredUserPhoneNumber = phoneNumber;
const message = 'Hello, your registration was successful!';
console.log(registeredUserPhoneNumber);
client.messages
  .create({
    body: message,
    from: process.env.YOUR_TWILIO_PHONE_NUMBER,
    to: registeredUserPhoneNumber
  })
  .then(message => console.log('SMS sent. Message SID:', message.sid))
  .catch(error => console.error('Error sending SMS:', error));
}
  res.status(201).json({
    status: "success",
    data: user,
  });
});

// @desc login admin
// @route POST/api/admins/login
// @acess Private
exports.loginAdminCtrl = async (req, res) => {
  // console.log(req.body);

  const { email, password } = req.body;
  try {
    // find user
    const user = await Admin.findOne({ email });
    console.log(user);
    // console.log(user);
    if (!user) {
      return res.json({ message: "user not found" });
    }
    // const isMatched = await bcrypt.compare(password, user.password);
    const isMatched = await isPassMatch(password, user.password);

    if (!isMatched) {
      return res.json({ message: "invalid credentials", isAuthorize: false });
    } else {
      return res.json({
        data: generateToken(user._id),
        message: "admin login successfully",
        isAuthorize: true,
      });
    }
    // if (user && (await user.verifyPassword(password))) {
    //   const token = generateToken(user._id);

    //   const verify = verifyToken(token);

    //   return res.json({
    //     data: generateToken(user._id),
    //     message: "admin login successfully",
    //   });
    // } else {
    //   return res.json({ message: "invalid credentials" });
    // }
    // res.status(201).json({
    //     status:"success",
    //     data:"Admin has been login"
    // })
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc Get all admin
// @route POST/api/admins
// @acess Private
exports.getAllAdminCtrl = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select("-password");
  res.status(200).json({
    status: "success",
    message: "Admin fetched successfully",
    data: admins,
  });
});

// @desc Get single admin
// @route POST/api/admins/:id
// @acess Private
exports.getSingleProfileCtrl = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt")
    .populate("academicYears");

  if (!admin) {
    throw new Error("Admin Not Found");
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin profile fetched sucessfully",
    });
  }
});

// @desc  update admin
// @route PUT/api/admins/:id
// @acess Private
exports.updateAdminCtrl = asyncHandler(async (req, res) => {
  // try {
  //   res.status(201).json({
  //     status: "success",
  //     data: "update  admin",
  //   });
  // } catch (error) {
  //   res.json({
  //     status: "failed",
  //     error: error.message,
  //   });
  // }

  const { email, name, password } = req.body;
  // find the admin
  // const admin = await Admin.findById(req.userAuth._id);
  // if email is taken
  const emailExist = await Admin.findOne({ email });

  if (emailExist) {
    throw new Error("this is email exist/taken");
  }

  // const salt = await bcrypt.genSalt(10);
  // const passWordHased = await bcrypt.hash(password,salt);
  // update

  // const admin = await Admin.findByIdAndUpdate(
  //   req.userAuth._id,
  //   {
  //     email,
  //     name,
  //   },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );
  // res.status(200).json({
  //   status: "success",
  //   data: admin,
  //   message: "admin updated sucessfully",
  // });

  if (password) {
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password,10),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "admin updated sucessfully",
    });
  } else {
    const admin = await Admin.findByIdAndUpdate(
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
      data: admin,
      message: "admin updated sucessfully",
    });
  }
});

// @desc  delete admin
// @route DELETE/api/admins/:id
// @acess Private
exports.deleteAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "delete  admin",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc admin suspending teacher
// @route POST/api/admins/suspend/teacher/:id
// @acess Private

exports.adminSuspendTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc admin suspending teacher
// @route POST/api/admins/unsuspend/teacher/:id
// @acess Private

exports.adminUnSuspendTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc admin withdraw teacher
// @route POST/api/admins/withdraw/teacher/:id
// @acess Private
exports.adminWithdrawTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc admin unwithdraw teacher
// @route POST/api/admins/unwithdraw/teacher/:id
// @acess Private
exports.adminUnWithdrawTeacher = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc admin  exam results teacher
// @route POST/api/admins/publish/exam/:id
// @acess Private

exports.adminPublishExamResult = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin publish exam ",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

// @desc admin  exam results teacher
// @route POST/api/admins/unpublish/exam/:id
// @acess Private
exports.adminUnPublishExamResult = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unpublish exam  teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
