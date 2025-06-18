const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  stack: [String],
  url: String,
  imagenes: [String],
});

module.exports = mongoose.model('Project', ProjectSchema);
