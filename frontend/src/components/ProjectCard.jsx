function ProjectCard({ project }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      borderRadius: "10px",
      backgroundColor: "black",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      maxWidth: "600px"
    }}>
      {/* Título y etiqueta privado */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "1.4rem" }}>{project.nombre}</h3>
        {project.private && (
          <span style={{
            color: "white",
            backgroundColor: "#d9534f",
            padding: "0.3rem 0.6rem",
            borderRadius: "6px",
            fontSize: "0.75rem"
          }}>
            🔒 Privado
          </span>
        )}
      </div>

      {/* Descripción */}
      <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#444" }}>
        {project.descripcion || "Sin descripción"}
      </p>

      {/* Stack o lenguaje */}
      {Array.isArray(project.stack) && project.stack.length > 0 ? (
        <p><strong>Stack:</strong> {project.stack.join(", ")}</p>
      ) : project.lenguaje && (
        <p><strong>Lenguaje:</strong> {project.lenguaje}</p>
      )}

      {/* Estrellas y forks */}
      {typeof project.stars !== 'undefined' && (
        <p>⭐ {project.stars} | 🍴 Forks: {project.forks}</p>
      )}

      {/* Enlace */}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}
        >
          Ver en GitHub →
        </a>
      )}
    </div>
  );
}

export default ProjectCard;
