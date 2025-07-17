# 🧠 Portafolio Profesional — Alejandro Muñoz

Este es un **portafolio web completo y funcional** desarrollado con tecnologías modernas como **React**, **Node.js**, **MongoDB**, y **Docker**. Su propósito es presentar proyectos personales, conectar con GitHub, mostrar experiencia técnica y, en un futuro, **ejecutar cada proyecto de github el cual disponga de un archivo docker-compose.yml**.

---

## 🚀 Tecnologías Principales

- ⚛️ **Frontend:** React (Vite) + SCSS + GSAP
- 🔧 **Backend:** Node.js + Express
- 🧠 **Base de Datos:** MongoDB (Docker)
- 🔌 **Integraciones:** GitHub API (repos públicos y privados)
- 🐳 **Contenedores:** Docker + Docker Compose
- ☁️ **Hosting:** Render (gratuito)
- 🧪 **Planes a Futuro:** Ejecución de software embebido o mediante sandbox, integración con microservicios y entorno de pruebas.

---

## 📁 Estructura del Proyecto
portafolio/
├── backend/
│ ├── src/
│ │ └── server/app.js
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ └── pages/
│ └── dist/ (build de producción)
├── docker-compose.yml
├── README.md
└── .gitignore
---

## ⚙️ Instalación y Desarrollo

### 1. Clona el proyecto

```bash
git clone https://github.com/bentlyy/Portafolio.git
cd Portafolio
📌 Funcionalidades
✅ Mostrar lista de proyectos desde MongoDB
✅ Mostrar repositorios de GitHub (con detalles)
✅ Vista responsiva y moderna
✅ Animaciones con GSAP
🛠️ [Próximamente] Ejecutar aplicaciones directamente desde el portafolio
🧪 [Próximamente] Zona de pruebas para usuarios (con entornos aislados tipo sandbox)

🧱 Planes a Futuro
Módulo	Estado	Descripción
🎮 Ejecutar proyectos	🟡 En diseño	Permitir demos de proyectos embebidos (iframe o contenedor aislado)
📡 Microservicios	🟡 En diseño	Dividir el backend por dominios funcionales (proyectos, usuarios, visitas, etc.)
📈 Panel de estadísticas	🔜 Planeado	Métricas de visitas, clics, interacción en tiempo real
🧪 Zona de pruebas	🔜 Planeado	Permitir probar software desde el frontend de forma segura
🔐 Autenticación Admin	🔜 Planeado	Interfaz para administrar el contenido del portafolio

🧠 Autor
👤 Alejandro Muñoz

🌐 GitHub: @bentlyy

📧 Email: (agrega si quieres que lo vean)

🖥️ Sitio web: (si usas dominio personalizado en Render o Vercel)

📜 Licencia
Este proyecto está licenciado bajo la MIT License.

✅ Recomendaciones
Siempre añade .env en .gitignore

Usa tokens de GitHub de solo lectura

Render es gratis, pero si escalas, considera servicios como Vercel + Mongo Atlas

Para demos en vivo puedes usar stackblitz.com o iframe con seguridad

✨ ¡Gracias por visitar!
Tu visita significa mucho. Este portafolio no solo muestra proyectos: representa evolución, aprendizaje y propósito profesional.
