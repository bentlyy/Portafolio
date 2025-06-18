import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/github/repos/${id}`)
      .then(res => setRepo(res.data))
      .catch(err => console.error('Error cargando repo:', err));
  }, [id]);

  if (!repo) return <p>Cargando repositorio...</p>;

  return (
    <div>
      <h2>{repo.nombre}</h2>
      <p>{repo.descripcion || 'Sin descripción'}</p>
      <p><strong>Languaje:</strong> {repo.lenguaje}</p>
      <p>⭐ {repo.stars} | Forks: {repo.forks}</p>
      <p>Creado: {new Date(repo.created_at).toLocaleDateString()}</p>
      <p>Última actualización: {new Date(repo.updated_at).toLocaleDateString()}</p>
      <a href={repo.url} target="_blank" rel="noreferrer">Ver en GitHub</a>
      <br /><br />
      <button onClick={() => navigate(-1)}>🔙 Volver</button>
    </div>
  );
}

export default ProjectDetail;
