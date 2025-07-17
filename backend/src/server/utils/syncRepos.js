const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');

// Detecta la rama por defecto remota de manera más robusta
function getDefaultBranch(repoPath) {
  try {
    // Primero intentamos con el método más moderno (Git 2.22+)
    try {
      const branch = execSync('git branch --show-current', {
        cwd: repoPath,
        stdio: ['pipe', 'pipe', 'ignore']
      }).toString().trim();
      
      if (branch) return branch;
    } catch (e) {
      // Si falla, continuamos con otros métodos
    }

    // Método alternativo para Git más antiguo
    try {
      const output = execSync('git remote show origin', {
        cwd: repoPath,
        stdio: ['pipe', 'pipe', 'ignore'],
        timeout: 5000 // timeout de 5 segundos
      }).toString();
      
      const match = output.match(/HEAD branch:\s*(.+)/);
      if (match) return match[1].trim();
    } catch (e) {
      console.error(`⚠️ No se pudo detectar rama remota en ${repoPath}`);
    }

    // Último recurso: verificar ramas locales
    try {
      const branches = execSync('git branch', {
        cwd: repoPath,
        stdio: ['pipe', 'pipe', 'ignore']
      }).toString();
      
      const currentBranch = branches.split('\n')
        .find(b => b.startsWith('*'))
        ?.replace('*', '').trim();
      
      return currentBranch || 'main';
    } catch (e) {
      console.error(`⚠️ No se pudo detectar rama local en ${repoPath}`);
    }

    return 'main'; // Fallback por defecto
  } catch (err) {
    console.error('❌ Error detectando rama por defecto:', err.message);
    return 'main';
  }
}

// Verifica si el repositorio tiene commits
function hasCommits(repoPath) {
  try {
    const output = execSync('git rev-list -n 1 --all', {
      cwd: repoPath,
      stdio: ['pipe', 'pipe', 'ignore'],
      timeout: 3000
    }).toString();
    return output.trim() !== '';
  } catch (err) {
    return false;
  }
}

// Verifica si el repositorio tiene un remote configurado
function hasRemote(repoPath) {
  try {
    const remotes = execSync('git remote', {
      cwd: repoPath,
      stdio: ['pipe', 'pipe', 'ignore']
    }).toString();
    return remotes.trim() !== '';
  } catch (err) {
    return false;
  }
}

// Clona o actualiza un repo localmente
async function syncRepo(repoName, cloneUrl) {
  const reposDir = path.join(__dirname, '..', '..', 'repos');
  const repoPath = path.join(reposDir, repoName);

  try {
    if (!fs.existsSync(reposDir)) {
      fs.mkdirSync(reposDir, { recursive: true });
    }

    if (!fs.existsSync(repoPath)) {
      console.log(`📥 Clonando ${repoName}...`);
      execSync(`git clone ${cloneUrl} ${repoName}`, { 
        cwd: reposDir,
        stdio: 'inherit',
        timeout: 60000 // 1 minuto para clonar
      });
      console.log(`✅ ${repoName} clonado correctamente`);
      return true;
    }

    console.log(`🔄 Actualizando ${repoName}...`);
    
    // Verificar si es un repositorio git válido
    if (!fs.existsSync(path.join(repoPath, '.git'))) {
      console.error(`❌ ${repoName} no es un repositorio git válido`);
      return false;
    }

    // Verificar si tiene remote configurado
    if (!hasRemote(repoPath)) {
      console.error(`❌ ${repoName} no tiene remote configurado`);
      return false;
    }

    const branch = getDefaultBranch(repoPath);
    console.log(`ℹ️ Rama detectada para ${repoName}: ${branch}`);

    // Solo hacer reset y clean si hay commits
    if (hasCommits(repoPath)) {
      try {
        execSync('git reset --hard HEAD', { 
          cwd: repoPath,
          stdio: 'ignore',
          timeout: 5000
        });
        execSync('git clean -fd', { 
          cwd: repoPath,
          stdio: 'ignore',
          timeout: 5000
        });
      } catch (error) {
        console.error(`⚠️ Error limpiando ${repoName}:`, error.message);
      }
    }

    // Actualizar el repo
    try {
      execSync(`git checkout ${branch}`, { 
        cwd: repoPath,
        stdio: 'inherit',
        timeout: 5000
      });
      
      execSync(`git pull origin ${branch}`, { 
        cwd: repoPath,
        stdio: 'inherit',
        timeout: 15000 // 15 segundos para pull
      });
      
      console.log(`✅ ${repoName} actualizado correctamente`);
      return true;
    } catch (error) {
      console.error(`❌ Error actualizando ${repoName}:`, error.message);
      throw error;
    }
  } catch (error) {
    console.error(`❌ Error crítico en ${repoName}:`, error.message);
    throw error;
  }
}

// Sincroniza todos los repos del usuario
async function syncRepos() {
  try {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username || !token) {
      throw new Error('Credenciales de GitHub no configuradas');
    }

    console.log('🔍 Obteniendo lista de repositorios de GitHub...');
    const response = await axios.get(`https://api.github.com/user/repos`, {
      headers: { Authorization: `token ${token}` },
      params: { 
        visibility: 'all', 
        affiliation: 'owner',
        per_page: 100
      },
      timeout: 10000
    });

    const repos = response.data;
    console.log(`📋 ${repos.length} repositorios encontrados`);

    const results = [];
    for (const repo of repos) {
      try {
        console.log(`\n--- Procesando ${repo.name} ---`);
        const success = await syncRepo(repo.name, repo.clone_url);
        results.push({
          name: repo.name,
          success,
          url: repo.html_url
        });
      } catch (error) {
        console.error(`❌ Error procesando ${repo.name}:`, error.message);
        results.push({
          name: repo.name,
          success: false,
          error: error.message,
          url: repo.html_url
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    console.log(`\n✅ ${successful}/${repos.length} repositorios sincronizados correctamente`);
    
    if (successful < repos.length) {
      const failed = results.filter(r => !r.success);
      console.error('⚠️ Repositorios con problemas:');
      failed.forEach(f => {
        console.error(`- ${f.name}: ${f.error || 'Error desconocido'}`);
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Error en syncRepos:', error.message);
    throw error;
  }
}

module.exports = {
  syncRepo,
  syncRepos,
  getDefaultBranch
};