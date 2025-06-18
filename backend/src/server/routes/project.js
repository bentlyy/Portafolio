const express = require("express");
const router = express.Router();
const { getAllProjects } = require("../controllers/projectController");

router.get("/", getAllProjects);

module.exports = router;
