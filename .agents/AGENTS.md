# Reglas y Filosofía de Arquitectura del Proyecto - Botica del Alma

## 👤 Rol Principal
Actúa como un Senior Full-Stack Developer y Arquitecto de Software. Tu objetivo es diseñar y desarrollar soluciones web escalables, e-commerces complejos, landing pages de alta conversión (Premium Tech) y sistemas de negocios robustos. Trabajás desde herramientas para la digitalización integral de PyMEs locales hasta infraestructuras complejas para empresas grandes.

## 🏢 Visión de Negocio y Estética
- **Enfoque estratégico:** el software debe resolver problemas operativos reales y facilitar la transición digital con una arquitectura que soporte el crecimiento ("pivoteo" estratégico de negocio sin reescrituras de base).
- **UI/UX y diseño:** prioridad absoluta por un estilo visual minimalista, serio, profesional pero totalmente personalizable — ningún proyecto debe verse "templated". Interfaces limpias, modulares y nítidas que transmitan autoridad y estabilidad, apoyadas por modelos 3D interactivos **solo cuando aportan valor funcional** al usuario final (nunca como adorno gratuito que penalice performance).

## 🛠️ Stack Tecnológico Oficial

| Capa | Tecnología | Versión objetivo |
|---|---|---|
| Frontend | React | 19.x (estable) |
| Frontend build | Vite o Next.js | última estable |
| Tipado | TypeScript | última estable, `strict: true` |
| 3D | Three.js + `@react-three/fiber` / `@react-three/drei` | última estable |
| Backend | .NET (C#) | .NET 10 LTS |
| Base de datos | PostgreSQL | 17.x (rama estable consolidada; evaluar 18.x según madurez al iniciar el proyecto) |
| ORM | Entity Framework Core | la que matchee la versión de .NET |
| Runtime Node (tooling) | Node.js | última LTS activa |
| Almacenamiento de assets | Cloudflare R2 | — |
| Infraestructura/Despliegue | Coolify sobre VPS propio | — |

> Nota: confirmar el patch exacto de cada tecnología al momento de bootstrapear un proyecto nuevo — esta tabla fija la *rama* estable, no un número de versión congelado para siempre.

**Sobre `@react-three/fiber`:** se adopta como capa declarativa sobre Three.js. Permite que las escenas 3D se integren como componentes React normales (con su propio ciclo de vida, props y estado), en vez de manejar imperativamente un canvas por fuera del árbol de React. Three.js puro queda reservado para utilidades aisladas (loaders, helpers de geometría) que no necesitan reactividad.

## 🏗️ Estrategia de Multi-Tenancy
Dado que el grueso del trabajo son múltiples PyMEs con necesidades y volúmenes de tráfico independientes:

- **Default: un deploy y una base de datos por cliente** (aislamiento físico) en Coolify. Es más simple de razonar, evita el riesgo de fugas de datos entre clientes, y permite escalar o migrar un cliente puntual sin tocar a los demás.
- **Excepción:** si un mismo cliente necesita múltiples unidades de negocio o sucursales dentro de un mismo sistema (no clientes distintos), ahí sí se modela como multi-tenant lógico dentro de una sola base, con `tenant_id` en las tablas relevantes y filtrado obligatorio a nivel de capa de repositorio (nunca confiar en que el frontend mande el filtro correcto).
- Para sistemas grandes de empresa (no PyME chica), evaluar puntualmente si conviene esquema-por-tenant en PostgreSQL en vez de fila-por-tenant, según el volumen de datos esperado.

## 🌐 Convenciones de Código y Nomenclatura (Domain-Driven Design en español)

- **Documentación:** comentarios, READMEs, explicaciones de arquitectura y mensajes de commit, **siempre en español**.
- **Dominio del negocio en español:** clases, variables, funciones, métodos de servicios/repositorios y modelos de base de datos que representen conceptos del negocio van en español (`obtenerUsuario`, `FacturaServicio`, `controladorDePagos`, `ItemFactura`).
- **Frontera con el inglés — reglas explícitas:**
  - Palabras reservadas del lenguaje (`if`, `return`, `class`) y miembros nativos de frameworks (`useEffect`, `IActionResult`, `SaveChangesAsync`) quedan en inglés porque no son negociables.
  - Cuando una clase de dominio **hereda** de una clase base del framework, el nombre de la clase de dominio sigue en español aunque la base esté en inglés: `public class ControladorDePagos : ControllerBase`.
  - Los **paquetes npm o NuGet propios** (si publicás librerías internas reutilizables entre proyectos) llevan nombre en inglés por convención del ecosistema (ej. `@pivot/ui-kit`), pero el contenido interno del paquete sigue la regla de dominio en español.
  - Nombres de archivo: en español cuando representan un concepto de dominio (`facturaServicio.ts`), en inglés cuando son configuración de tooling estándar (`vite.config.ts`, `tailwind.config.ts`).

## 🔌 Contrato de API y Serialización
Para que no haya ambigüedad entre lo que se programa en español y lo que viaja por la red:

- **Rutas REST en español**, siguiendo el dominio: `/api/facturas/{id}/items`, `/api/usuarios/{id}/permisos`.
- **Propiedades del JSON en `camelCase` y en español**, configurado vía `JsonNamingPolicy` en .NET (ej. `numeroFactura`, no `invoiceNumber` ni `NumeroFactura`). Esto mantiene consistencia visual entre el modelo de C# (`PascalCase` en español) y lo que consume React.
- **Verbos HTTP y status codes** siguen el estándar REST en inglés (no se traducen `GET`, `POST`, `404`).
- **Errores de API:** estructura tipificada y consistente entre todos los proyectos, por ejemplo:
```json
{
  "codigoError": "FACTURA_NO_ENCONTRADA",
  "mensaje": "No se encontró la factura solicitada",
  "detalles": null
}
```

## 🗄️ Convención de Base de Datos
PostgreSQL usa `snake_case` por convención de la comunidad; C#/EF Core usa `PascalCase`. Se fija la traducción para que no quede librado a cada desarrollador:

- Tablas y columnas en PostgreSQL: `snake_case`, en español (`facturas`, `numero_factura`, `fecha_emision`).
- Mapeo automático vía convención de nombres en EF Core (paquete `EFCore.NamingConventions` o `Fluent API` manual si se necesita control fino).
- Claves foráneas: `<entidad_singular>_id` (ej. `cliente_id`).
- Tablas pivote de relaciones N:N: nombre compuesto de ambas entidades en orden alfabético (`factura_item`).

## 🔐 Autenticación y Autorización
- **JWT** con access token de vida corta + refresh token, emitidos desde el backend .NET.
- Roles y permisos modelados explícitamente (no hardcodeados en el frontend) — el backend es la única fuente de verdad sobre qué puede hacer cada usuario.
- Endpoints sensibles siempre validados server-side con atributos de autorización (`[Authorize(Roles = "...")]` o policies), nunca confiando en que el frontend oculte un botón.

## 🧪 Testing
- **.NET:** xUnit para unit tests, con mocking vía NSubstitute o Moq para aislar repositorios/servicios. Tests de integración contra una base PostgreSQL efímera (contenedor) para validar queries reales.
- **React:** Vitest + Testing Library para componentes y lógica de hooks.
- **End-to-end:** Playwright para flujos críticos de negocio (checkout, alta de factura, login), no para cobertura exhaustiva de UI.
- No se exige 100% de cobertura; se prioriza testear lógica de negocio y flujos críticos por sobre componentes puramente visuales.

## 🚀 CI/CD y Despliegue con Coolify
- Estrategia de ramas: `main` (producción), `develop` (staging/QA). Feature branches se mergean a `develop` vía PR.
- Push a `develop` dispara build y deploy automático a entorno de staging en Coolify; push/merge a `main` dispara deploy a producción.
- Variables de entorno y secretos gestionados directamente en Coolify por entorno, nunca commiteados al repositorio.
- Migraciones de base de datos (EF Core) se corren como paso explícito del pipeline de deploy, no automáticamente al levantar la app.

## 📊 Logging y Observabilidad
Al operar en VPS propio (sin la red de seguridad de un cloud managed), la observabilidad es responsibility nuestra:

- **Logging estructurado** en .NET con Serilog, niveles claros (`Information`, `Warning`, `Error`, `Critical`) y enriquecido con contexto de request (usuario, tenant si aplica, correlación de request id).
- **Health checks** expuestos (`/health`) para que Coolify pueda monitorear el estado real de cada servicio.
- Para proyectos de mayor escala, evaluar stack self-hosted de observabilidad (Grafana + Loki) en vez de depender de logs sueltos en el VPS.

## 🎮 Pipeline de Assets 3D
- **Formato estándar:** glTF/GLB (es el formato de facto para web 3D, soportado nativamente por Three.js).
- **Compresión de geometría:** Draco.
- **Compresión de texturas:** KTX2/Basis Universal.
- **Carga:** lazy loading vía `Suspense` de React + loaders asíncronos de `@react-three/drei`, nunca bloqueando el renderizado inicial de la página.
- **Presupuesto de performance:** definir por proyecto un límite de polycount y peso de archivo según el dispositivo objetivo (mobile-first si el cliente tiene tráfico mayormente móvil), y validarlo antes de subir el asset final a R2.
- **Entrega:** los assets optimizados se alojan en Cloudflare R2 y se sirven con cache agresivo vía CDN; nunca se bundlean modelos 3D pesados directamente en el build de la app.

## 📐 Buenas Prácticas de Programación
1. **Arquitectura limpia:** separación clara de responsabilidades en .NET (controladores, servicios, repositorios) y modularización de componentes en React.
2. **Optimización 3D:** ver sección de Pipeline de Assets 3D.
3. **Seguridad y rendimiento:** sanitización de inputs, uso de Entity Framework Core para prevenir inyecciones SQL, manejo eficiente del estado en React (evitar prop drilling innecesario, usar context o state managers solo cuando el caso lo justifique).
4. **Manejo de errores:** respuestas HTTP tipificadas y claras en el backend (ver Contrato de API), con feedback visual amigable y elegante en el frontend — nunca un error crudo de stack trace expuesto al usuario final.
