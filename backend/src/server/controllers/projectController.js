const Project = require("../models/project");

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proyectos" });
  }
};

module.exports = { getAllProjects };
