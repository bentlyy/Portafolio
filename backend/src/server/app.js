const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const { syncRepos } = require('./utils/syncRepos');
const portfolioRoutes = require('./routes/project');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de MongoDB
mongoose.connect('mongodb://localhost:27017/portafolio', {})
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error en conexión Mongo", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
app.use('/', portfolioRoutes);
app.use('/api/github', githubRoutes);

// Sincronización inicial de repositorios
(async () => {
  try {
    await syncRepos();
    console.log('✅ Repositorios sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar repositorios:', error);
  }
})();

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});