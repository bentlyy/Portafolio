const express = require('express');
const router = express.Router();
const {
  getGithubRepos,
  cloneAndRunProject,
  getExecutableProjects
} = require('../controllers/githubController');

// Obtener lista de repositorios de GitHub
router.get('/repos', getGithubRepos);

// Obtener proyectos con docker-compose disponibles
router.get('/executables', getExecutableProjects);

// Ejecutar un proyecto específico
router.post('/run/:repoName', cloneAndRunProject);

module.exports = router;