const Admin = require("../../model/Staff/Admin");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { hashPassword, isPassMatch } = require("../../utils/helpers");
const twilio = require('twilio');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
// @desc Register admin
// @route POST/api/admins/register
// @acess Private
exports.registerAdminCtrl = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;




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
  let image = "https://t3.ftcdn.net/jpg/03/01/24/58/240_F_301245840_zwJpFB1MCmJkTg1tMDK9pFnCwce6dQ1T.jpg"

  if (!adminFound) {
    // Create the email message
    const mailOptions = {
      from: 'joysundaran@gmail.com',
      to: email,
      // subject: 'Registration Confirmation',
      subject: 'Welcome to learning Platform!',
      // text: `Dear ${name},\n\nThank you for registering on our website.`
      html: `
    <h2>Dear ${name},</h2>
    <p>Thank you for registering on learning Platform! We are excited to have you as part of our learning community.</p>
    <p style="text-align: center;"><img src="${image}" alt="Reset Password Image"></p>
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

  // sms register user
  // const accountSid = process.env.YOUR_ACCOUNT_SID;
  // const authToken = process.env.YOUR_AUTH_TOKEN;
  // const client = require('twilio')(accountSid, authToken);
  // const registeredUserPhoneNumber = phoneNumber;
  // const message = 'Hello, your registration was successful!';
  // // console.log(registeredUserPhoneNumber);
  // client.messages
  //   .create({
  //     body: message,
  //     from: process.env.YOUR_TWILIO_PHONE_NUMBER,
  //     to: registeredUserPhoneNumber
  //   })
  //   .then(message => console.log('SMS sent. Message SID:', message.sid))
  //   .catch(error => console.error('Error sending SMS:', error));

  res.status(201).json({
    status: "success",
    data: user,
  });

  const accountSid = process.env.YOUR_ACCOUNT_SID;
  const authToken = process.env.YOUR_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      body: 'welcome learning accademy ',
      from: process.env.YOUR_TWILIO_PHONE_NUMBER,
      to: phoneNumber
    })
    .then(message => console.log(message.sid))
    .done();

  // client.messages
  //   .create({
  //     body: 'Welcome to learning academy!',
  //     from: process.env.YOUR_TWILIO_PHONE_NUMBER,
  //     to: phoneNumber
  //   })
  //   .then(message => console.log(message.sid))
  //   .catch(error => console.error(error));

  // sms whatsapp
  client.messages
    .create({
      body: 'Your appointment is coming up on July 21 at 3PM',
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${phoneNumber}`
    })
    .then(message => console.log(message.sid, "sent"))
    .done();
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
        status: "success",
        message: "admin login successfully",
        isAuthorize: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
          // Add other user information as needed
        },
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


// @ forgot password
exports.forgotAdminCtrl = async (req, res) => {
  console.log(req.body)
  const { email } = req.body
  try {
    // Find the user by email
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Token is valid for 1 hour

    // Update user with reset token and expiration
    Admin.resetToken = resetToken;
    Admin.resetTokenExpiration = resetTokenExpiration;
    await Admin.create();
    let image = "  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsjv8k9FpJH5AvquxbVyd06B5UludsXYeHuTLTGllucw&s"
    // Send password reset email
    const mailOptions = {
      from: 'joysundaran@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset for your account.</p>
        <p>Click <a href="http://your-app.com/reset-password/${resetToken}">here</a> to reset your password.</p>
        <p><img src="${image}" alt="Reset Password Image"></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// @resetPassword
exports.resetPasswordCtrl = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Find the user by reset token and check token expiration
    const user = await Admin.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user with the new password and clear reset token fields
    Admin.password = hashedPassword;
    Admin.resetToken = undefined;
    Admin.resetTokenExpiration = undefined;

    await Admin.save();

    // Send password reset email
    const mailOptions = {
      from: 'joysundaran@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `
        <p>"The password has been successfully reset."</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
        password: await hashPassword(password, 10),
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
