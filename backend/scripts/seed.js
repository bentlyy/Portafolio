const mongoose = require('mongoose');
const Project = require('../src/server/models/project');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/portafolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const proyectos = [
  {
    nombre: "Inventario de Bodega",
    descripcion: "App de inventario hecha en Node y MySQL con autenticación.",
    stack: ["Node.js", "Express", "MySQL", "Bootstrap"],
    url: "",
    imagenes: ["/imgs/bodega1.png", "/imgs/bodega2.png"]
  },
  {
    nombre: "Gestor de Tareas",
    descripcion: "CRUD de tareas local, hecho con Vanilla JS y Mongo.",
    stack: ["HTML", "CSS", "JavaScript", "MongoDB"],
    url: "",
    imagenes: ["/imgs/tareas1.png"]
  },
  {
    nombre: "Simulador de Riego",
    descripcion: "Simula riego agrícola con sensores virtuales.",
    stack: ["React", "Node", "Socket.IO"],
    url: "",
    imagenes: []
  }
];

Project.insertMany(proyectos)
  .then(() => {
    console.log("✅ Proyectos insertados correctamente");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error insertando proyectos:", err);
    mongoose.connection.close();
  });
