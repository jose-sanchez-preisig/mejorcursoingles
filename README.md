# mejorcursoingles.com

Comparador de cursos de inglés online, basado en reseñas reales, reputación y análisis de experiencia de usuario.

## 🚀 ¿Qué contiene este repositorio?

- HTML estático para cada curso (`/cursos/`)
- Página principal (`index.html`)
- Página de ranking general (`los-mejores-cursos-de-ingles.html`)
- JSON consolidado de cursos (`/data/cursos-index.json`)
- **El generador no está incluido públicamente en este repositorio** (`/generador/` está en el `.gitignore`)

## ⚙️ Cómo generar el sitio (uso interno)

> ⚠️ La carpeta `generador/` no está en el repositorio público. Asegúrate de tenerla localmente.

### 1. Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Mac/Linux
venv\Scripts\activate     # En Windows

### 2. Instalar dependencias
pip install -r requirements.txt

### 3. Ejecutar el generador
python generador/generar.py