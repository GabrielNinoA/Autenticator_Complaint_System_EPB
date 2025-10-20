# Reglas de Desarrollo - Sistema de Quejas Boyacá

## 1. Documentación previa
- Antes de iniciar cualquier desarrollo, documenta en los requisitos o documentación existente la nueva funcionalidad, modificación o corrección, **solo si no está documentada o está desactualizada**.
- Si la funcionalidad ya está correctamente documentada, este paso puede omitirse.

## 2. Creación de Issue
- Crea una issue en el repositorio con la siguiente estructura:
  - **Título**
  - **Descripción del problema o necesidad**
  - **Cambios solicitados**
  - **Comportamiento esperado**
  - **Prioridad**

## 3. Tarea en el tablero de trabajo
- Crea la tarea en el tablero (Kanban, Projects, etc.) con título y descripción.
- Asigna la tarea a un integrante del grupo.

## 4. Desarrollo en rama específica
- Crea una rama para cada issue, siguiendo la estructura:
  - `acción-a-hacer` + `-` + `lugar-afectado`
  - Ejemplo: `Feat-delete-complaints`
- Realiza **commits atómicos** con la estructura:
  - `prefijo-accion` + `:` + `descripción del cambio`
  - Ejemplo: `feat: add backend of the feature delete complaints...`
- Prefijos válidos para los commits:
  - `feat` : Features
  - `fix` : Bug Fixes
  - `doc` : Documentation
  - `refactor` : Refactor
  - `style` : Styling
  - `test` : Testing
  - `revert` : Revert

## 5. Pull Request (PR) a develop
- Al finalizar la tarea, realiza un PR hacia la rama `develop`.
- El PR debe contener:
  - Título con referencia a la issue que soluciona
  - Descripción clara de lo realizado
  - Al menos **1 reviewer** asignado (el merge solo se realiza si el reviewer aprueba)
  - Deben pasar todos los checks de GitHub Actions

## 6. Merge a develop
- Solo después de la aprobación y los checks exitosos, realiza el merge a la rama `develop`.

---

**Nota:** Este flujo es obligatorio para cualquier cambio en el proyecto y busca asegurar trazabilidad, calidad y colaboración efectiva en el equipo.