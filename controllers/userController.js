const User = require('../models/userModel');
const AppError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// check role which not allowed to change and other fields
const filterObj = (obj, ...allowedFields) => {
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async () => {
  // 1) create errpr if user popsts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('the route is not for password update'));
  }

  // 2) filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! please use /signup for now'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// do not update password wit this

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
