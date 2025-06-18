const axios = require('axios');

const getGithubRepos = async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    const response = await axios.get(`https://api.github.com/user/repos`, {
      headers: {
        Authorization: `token ${token}`
      },
      params: {
        visibility: 'all',  // Para obtener repos públicos y privados
        affiliation: 'owner' // Solo repos que poseas
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
    console.error(error);
    res.status(500).json({ message: 'Error al obtener repositorios de GitHub' });
  }
};

module.exports = { getGithubRepos };
