import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap'

const ProjectCard = ({ project, isRunning, onRun, onStop }) => {
  return (
    <Card className="h-100 hover-shadow">
      <Card.Body>
        <Card.Title>
          {project.name}
          <Badge bg="primary" className="ms-2">Docker</Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Puerto: <Badge bg="light" text="dark">{project.port || 'No especificado'}</Badge>
        </Card.Subtitle>
        
        <div className="mt-3">
          {isRunning ? (
            <>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => onStop(project.name)}
                className="me-2"
              >
                <span className="status-dot bg-success me-1"></span>
                🛑 Detener
              </Button>
              <a 
                href={`http://localhost:${project.port}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-success btn-sm"
              >
                🌐 Abrir Proyecto
              </a>
            </>
          ) : (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onRun(project.name)}
            >
              <span className="status-dot bg-danger me-1"></span>
              🚀 Iniciar
            </Button>
          )}
          
          <a 
            href={`/repos/${project.name}`} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-outline-secondary btn-sm ms-2"
          >
            📂 Ver Archivos
          </a>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProjectCard