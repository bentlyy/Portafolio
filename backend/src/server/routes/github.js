const express = require('express');
const router = express.Router();
const { getGithubRepos } = require('../controllers/githubController');

router.get('/repos', getGithubRepos);

router.get('/repos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const username = 'tu_usuario_github';
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    const repo = response.data.find(r => r.id === id);
    if (!repo) return res.status(404).json({ message: 'Repositorio no encontrado' });
    
    res.json({
      id: repo.id,
      nombre: repo.name,
      descripcion: repo.description,
      url: repo.html_url,
      lenguaje: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener repositorio' });
  }
});

module.exports = router;
