import { Link } from "react-router-dom";

function Navbar() {
  return (
      <nav style={{
    background: "#333",
    padding: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
  }}>

      <ul style={{ display: "flex", gap: "1rem", listStyle: "none", margin: 0 }}>
        <li><Link to="/" style={{ color: "#fff" }}>Inicio</Link></li>
        <li><Link to="/proyectos" style={{ color: "#fff" }}>Proyectos</Link></li>
        <li><Link to="/sobre-mi" style={{ color: "#fff" }}>Sobre mí</Link></li>
        <li><Link to="/contacto" style={{ color: "#fff" }}>Contacto</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
