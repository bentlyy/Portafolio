const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { syncRepo } = require('../utils/syncRepos');

const execPromise = (cmd, cwd = process.cwd()) => new Promise((resolve, reject) => {
  exec(cmd, { cwd }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return reject(error);
    }
    resolve(stdout);
  });
});

// ✅ Obtener repos desde GitHub
const getGithubRepos = async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(400).json({ message: 'Token de GitHub no configurado' });
    }

    const response = await axios.get(`https://api.github.com/user/repos`, {
      headers: { Authorization: `token ${token}` },
      params: {
        visibility: 'all',
        affiliation: 'owner',
        per_page: 100
      }
    });

    const repos = response.data.map(repo => ({
      id: repo.id,
      nombre: repo.name,
      descripcion: repo.description,
      url: repo.html_url,
      lenguaje: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      private: repo.private
    }));

    res.json(repos);
  } catch (error) {
    console.error('Error al obtener repositorios:', error.message);
    res.status(500).json({
      message: 'Error al obtener repositorios de GitHub',
      error: error.message
    });
  }
};

// ✅ Escanear proyectos con docker-compose
const scanForDockerComposeProjects = () => {
  const reposDir = path.join(__dirname, '../../repos');
  const projects = [];

  if (!fs.existsSync(reposDir)) {
    return projects;
  }

  const repoDirs = fs.readdirSync(reposDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  repoDirs.forEach(repoName => {
    const repoPath = path.join(reposDir, repoName);
    const composePath = path.join(repoPath, 'docker-compose.yml');

    if (fs.existsSync(composePath)) {
      try {
        const composeContent = fs.readFileSync(composePath, 'utf8');
        const portsMatch = composeContent.match(/ports:\s*-\s*"(\d+):\d+"/);
        const port = portsMatch ? portsMatch[1] : 'No especificado';

        projects.push({
          name: repoName,
          path: repoPath,
          port: port,
          hasCompose: true
        });
      } catch (err) {
        console.error(`Error leyendo docker-compose en ${repoName}:`, err);
      }
    }
  });

  // Guardar la lista en JSON
  const outputPath = path.join(reposDir, 'composeProjects.json');
  fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

  return projects;
};

// ✅ Devolver proyectos ejecutables
const getExecutableProjects = async (req, res) => {
  try {
    const projects = scanForDockerComposeProjects();
    res.json(projects);
  } catch (e) {
    console.error('Error al obtener proyectos ejecutables:', e);
    res.status(500).json({
      message: 'Error al cargar proyectos ejecutables',
      error: e.message
    });
  }
};

// ✅ Detener contenedor previo
const stopPreviousProject = async () => {
  try {
    await execPromise('docker compose -p sandbox down -v --remove-orphans');
    console.log('⛔ Proyecto anterior detenido');
  } catch (err) {
    console.log('ℹ️ No hay proyecto previo corriendo o error al detener:', err.message);
  }
};

// ✅ Ruta para clonar (si no existe) y levantar proyecto
const cloneAndRunProject = async (req, res) => {
  const { repoName } = req.params;
  const reposDir = path.join(__dirname, '../../repos');
  const repoPath = path.join(reposDir, repoName);
  const composePath = path.join(repoPath, 'docker-compose.yml');

  try {
    // Clonar o actualizar repo
    const repoUrl = `https://github.com/${process.env.GITHUB_USERNAME}/${repoName}.git`;
    await syncRepo(repoName, repoUrl); // <- usa git clone o pull

    if (!fs.existsSync(composePath)) {
      return res.status(400).json({
        message: 'El proyecto no tiene docker-compose.yml'
      });
    }

    // Detener cualquier proyecto anterior
    await stopPreviousProject();

    // Ejecutar el nuevo proyecto con docker-compose
    await execPromise(`docker-compose -f "${composePath}" up -d --build`);

    // Leer puerto
    const composeContent = fs.readFileSync(composePath, 'utf8');
    const portsMatch = composeContent.match(/ports:\s*-\s*"(\d+):\d+"/);
    const port = portsMatch ? portsMatch[1] : '8080';

    res.json({
      message: `✅ Proyecto ${repoName} levantado correctamente`,
      url: `http://localhost:${port}`,
      port: port
    });
  } catch (err) {
    console.error('Error al ejecutar proyecto:', err);
    res.status(500).json({
      message: 'Error al levantar el proyecto',
      error: err.message
    });
  }
};

module.exports = {
  getGithubRepos,
  cloneAndRunProject,
  getExecutableProjects,
  scanForDockerComposeProjects
};
