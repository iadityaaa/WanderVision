//const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Kumar Aditya",
//     email: "test@test.com",
//     password: "testers",
//   },
// ];

const getUsers = async (req, res, next) => {
  //res.json({ users: DUMMY_USERS });
  //Not giving password as a response (using the concept of protection)
  //const users = User.find({},'email name') or
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  //We need to link the file to our user in the db so create a image url(linking the file using using req.body.path(a multer property) in image)
  //Rollback if we have validation error(we are doing it by directly modifying the error handler middleware in the app.js)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  //checking for unique email id(if email id already exists)
  // const hasUser = DUMMY_USERS.find(u => u.email === email);
  // if (hasUser) {
  //   throw new HttpError('Could not create user, email already exists.', 422);
  // }

  //Email validation to check if unique email exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    //This might also return an empty obj so we check below if the user is not empty then the user exists.
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    console.log(err);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead.",
      422
    );
    return next(error);
  }
  const createdUser = new User({
    //id: uuid(),
    name, // name: name
    email,
    password, // Storing the non encrypted password is a serious threat issue
    image: req.file.path,//uploads/images/img
    places: [],
  });

  //DUMMY_USERS.push(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    console.log(err);
    return next(error);
  }

  //Right now the response has the password
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //No token yet so we can't validate our data now
  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    console.log(err);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Could not log you in, credentials seem to be wrong.", 401)
    );
  }
  //returning existingUser as well and mapping it to a user property
  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
