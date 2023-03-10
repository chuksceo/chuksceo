var express = require("express");
var router = express.Router();
var signupController = require("./../controller/signupController");
var personalDataController = require("./../controller/personalDataController");

router.route("/patient").post(signupController.patientSignup);
router.route("/doctor").post(signupController.doctorSignup);
router.route("/getcontact").get(personalDataController.getContact);
router.route("/addcontact").post(personalDataController.addContact);

module.exports = router;
