import React, { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [runningProject, setRunningProject] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/github/executables')
      if (!response.ok) throw new Error('Error al cargar proyectos')
      const data = await response.json()
      setProjects(data)
      await checkRunningProject()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkRunningProject = async () => {
    try {
      const response = await fetch('/api/github/status')
      if (response.ok) {
        const data = await response.json()
        if (data.runningProject) {
          setRunningProject(data.runningProject)
        }
      }
    } catch (err) {
      console.error('Error checking status:', err)
    }
  }

  const handleRunProject = async (projectName) => {
    try {
      // Detener proyecto actual si hay uno corriendo
      if (runningProject && runningProject !== projectName) {
        await handleStopProject(runningProject)
      }

      const response = await fetch(`/api/github/run/${projectName}`, {
        method: 'POST'
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Error al iniciar proyecto')

      setRunningProject(projectName)
      alert(`✅ ${data.message}\nAccede en: ${data.url}`)
    } catch (err) {
      alert(`❌ ${err.message}`)
    }
  }

  const handleStopProject = async (projectName) => {
    try {
      const response = await fetch('/api/github/stop', {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Error al detener proyecto')

      setRunningProject(null)
    } catch (err) {
      alert(`❌ ${err.message}`)
    }
  }

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Cargando proyectos...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Mis Proyectos Docker</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          <Alert variant="info">
            <strong>ℹ️ Información:</strong> Estos proyectos tienen docker-compose.yml y pueden ser ejecutados.
          </Alert>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="outline-secondary" onClick={fetchProjects}>
            🔄 Actualizar Lista
          </Button>
        </Col>
      </Row>

      {projects.length === 0 ? (
        <div className="text-center py-5">
          <h4>No hay proyectos con docker-compose.yml disponibles</h4>
          <p>Agrega archivos docker-compose.yml a tus repositorios para verlos aquí.</p>
        </div>
      ) : (
        <Row>
          {projects.map((project) => (
            <Col key={project.name} md={6} className="mb-4">
              <ProjectCard 
                project={project}
                isRunning={runningProject === project.name}
                onRun={handleRunProject}
                onStop={handleStopProject}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Projects