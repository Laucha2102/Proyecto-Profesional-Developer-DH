ReservaYa: Plataforma de Reservas de Alojamientos

📝 Descripción del Proyecto ReservaYa es una plataforma de reservas de alojamiento full-stack que gestiona productos, usuarios, seguridad y el flujo completo de reservas. El proyecto fue desarrollado demostrando la implementación de una Arquitectura RESTful de 3 Capas (Backend, Servicios y Datos), con un enfoque riguroso en la persistencia de datos (JPA) y la seguridad (JWT).

⭐ Características Principales El proyecto cubre la funcionalidad de usuario y administrador en tres grandes dominios:

Seguridad y Autenticación Acceso Restringido: Implementación completa de Spring Security para proteger endpoints mediante JSON Web Tokens (JWT).
Control de Roles: Asignación de permisos (ROLE_ADMIN) para restringir el acceso a paneles de creación y edición de productos (/administracion).

Flujo de Usuario: Login, Registro y Mantenimiento de Sesión sin estado (Stateless).

Catálogo y Búsqueda Paginación y Listado: Listado paginado de productos en la página principal (Home).
Búsqueda Avanzada: Filtrado de productos por Ciudad y Rango de Fechas (validando la disponibilidad en la base de datos).

Filtrado por Categoría: Permite listar productos al hacer clic en las tarjetas de categorías.

Reserva y Detalle de Producto Detalle de Producto: Vista completa con galería de imágenes, características, y bloque de Políticas (US #26).
Disponibilidad (US #23): Calendario interactivo que muestra las fechas ocupadas (no disponibles).

Flujo de Reserva (US #30-32): Proceso guiado para usuarios autenticados que incluye validación de fechas en el servidor y confirmación de la reserva.

Historial (US #33): Página /mis-reservas para que el usuario acceda a su listado de reservas.

Puntuaciones (US #28): Sistema de valoración por estrellas y envío de reseñas.
