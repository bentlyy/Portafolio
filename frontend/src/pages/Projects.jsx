import { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

function Projects() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/github/repos')
      .then(res => setRepos(res.data))
      .catch(err => console.error('Error al cargar repos de GitHub:', err));
  }, []);

  return (
    <section style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Repositorios de GitHub</h1>
      
      {repos.length === 0 ? (
        <p>No hay repositorios disponibles.</p>
      ) : (
        repos.map(repo => (
          <ProjectCard key={repo.id} project={repo} />
        ))
      )}
    </section>
  );
}

export default Projects;
