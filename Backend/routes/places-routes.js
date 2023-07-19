// or {Router} = rquire('express);
const express = require("express");
//We need express here to create express router
const { check } = require("express-validator");
//check func will return a new validator configured for our validation requirement
// here we are doing object destructuring to get only a particular package form express-validator
const fileUpload = require('../custom-middleware/file-upload');

const placesControllers = require("../controllers/places-controllers");

//const router = Router();
const router = express.Router();

// router.get('/',(req,res,next)=>{
//   console.log('GET Request in Places');
//   //It will take any json data which can be converted to a valid json format(for ex-bool,obj,array,etc)
//   res.json({message:'It works!'});
// });

//Here the paths are after the initial filter we have in app.js already
router.get("/:pid", placesControllers.getPlaceById);
//dynamic path is mentioned by : and extracted by parmas property in express(like in react),see places-controller
router.get("/user/:uid", placesControllers.getPlacesByUserId);

//Path is nothing bcs the idea is that any post req for /api/places/ automatically reaches this route
//if(title.trim.length!=0) types validator check is also possible but are very cumbersome
router.post(
  "/",
  fileUpload.single('image'),
  //If you enter something in the url its automatically a get request
  //You can try some JS but it wont work (to be told) instead use postman (its a tool that allows you to test and send req to the api)
  //Multiple check middlewares goruped together as an array
  [
    //We are adding a check middleware
    //multiple middlewares could be passed on a particular path/req and they will be executed from left to right
    //check takes the name of the filed in your req body
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  //Carrying the data of the above middleware it will go to placeController and there we throw error if needed
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

//This is the export format in express js
//(This means that we are exporting router form this file)
module.exports = router;
