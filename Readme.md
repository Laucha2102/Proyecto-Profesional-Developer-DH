# 🏨 ReservaYa: Plataforma de Reservas de Alojamientos

## 📝 Descripción del Proyecto
**ReservaYa** es una plataforma de reservas de alojamiento *full-stack* diseñada para gestionar productos, usuarios, seguridad y el flujo completo de reservas turísticas.

El proyecto fue desarrollado simulando un entorno profesional bajo metodología **Scrum**, implementando una **Arquitectura RESTful de 3 Capas** (Backend, Servicios y Datos), con un enfoque riguroso en la persistencia de datos (MySQL/JPA) y la seguridad informática (JWT).

---

## 🚀 Stack Tecnológico
* **Backend:** Java, Spring Boot, Spring Security, JWT.
* **Base de Datos:** MySQL, Hibernate (JPA).
* **Frontend:** React, HTML5, CSS3.
* **Infraestructura:** AWS (S3 para imágenes / EC2).
* **Herramientas:** Git/GitLab, Maven, Postman.

---

## 🗺️ Roadmap de Desarrollo (Detalle por Sprints)
A continuación se detallan las funcionalidades implementadas en cada iteración, basadas en las Historias de Usuario (US) aprobadas.

### 🚩 Sprint 1: MVP e Infraestructura Base
*Enfoque: Estructura visual y gestión administrativa básica.*
* **US #1 - Encabezado:** Implementación de Header con logo y navegación.
* **US #2 - Cuerpo del Sitio:** Definición de paleta de colores e identidad de marca.
* **US #3 - Registrar Producto:** Formulario administrador para crear nuevos alojamientos.
* **US #4 - Home:** Visualización de listado de productos aleatorios.
* **US #5 - Detalle de Producto:** Vista individual con información básica del alojamiento.
* **US #6 - Galería:** Visualización de imágenes del producto (Grid principal + secundarias).
* **US #7 - Pie de Página:** Footer con información legal y redes.
* **US #8 - Paginación:** Limitación de resultados en Home para optimizar carga.
* **US #9 - Panel de Administración:** Acceso exclusivo para gestión del negocio.
* **US #10 - Listar Productos:** Tabla administrativa para visualizar el stock.
* **US #11 - Eliminar Producto:** Funcionalidad de baja de productos (Soft/Hard delete).

### 🚩 Sprint 2: Usuarios, Roles y Categorización
*Enfoque: Seguridad (Spring Security) y organización del catálogo.*
* **US #12 - Categorizar Productos:** Asignación de categorías (Hoteles, Hostels, Deptos).
* **US #13 - Registro de Usuario:** Formulario con validación de campos (nombre, email, password).
* **US #14 - Login (JWT):** Autenticación de usuarios y entrega de Token.
* **US #15 - Cerrar Sesión:** Invalidación de sesión (Logout).
* **US #16 - Roles:** Gestión de permisos `ROLE_USER` y `ROLE_ADMIN`.
* **US #17 - Administrar Características:** CRUD de amenities (Wifi, Piscina) con iconos.
* **US #18 - Visualizar Características:** Bloque de iconos en el detalle del producto.
* **US #19 - Notificación Registro:** Email de bienvenida al registrarse (Desafío Opcional).
* **US #20 - Filtrado por Categoría:** Buscador rápido mediante tarjetas de categorías.
* **US #21 - Agregar Categoría:** ABM de categorías desde el panel admin.

### 🚩 Sprint 3: Búsqueda Avanzada y Experiencia de Usuario
*Enfoque: Motor de disponibilidad y funciones sociales.*
* **US #22 - Buscador:** Filtro combinado por **Ciudad** y **Rango de Fechas**.
* **US #23 - Disponibilidad:** Calendario interactivo que bloquea fechas ocupadas visualmente.
* **US #24 - Favoritos:** Botón para agregar productos a "Wishlist".
* **US #25 - Lista de Favoritos:** Panel de usuario para gestionar sus preferidos.
* **US #26 - Políticas:** Bloque informativo (Normas, Seguridad, Cancelación).
* **US #27 - Redes Sociales:** Compartir producto en Facebook, Twitter, Instagram.
* **US #28 - Puntuación:** Sistema de estrellas y reseñas para usuarios que reservaron.
* **US #29 - Eliminar Categoría:** Gestión administrativa de categorías obsoletas.

### 🚩 Sprint 4: Motor de Reservas y Fidelización
*Enfoque: Cierre del circuito comercial (Booking).*
* **US #30 - Selección de Fechas:** Validación server-side de rangos disponibles.
* **US #31 - Detalle de Reserva:** Resumen de compra antes de confirmar.
* **US #32 - Confirmar Reserva:** Creación de la orden en Base de Datos.
* **US #33 - Historial:** Panel "Mis Reservas" con listado de viajes pasados y futuros.
* **US #34 - WhatsApp:** Botón flotante para chat directo con soporte.
* **US #35 - Email Reserva:** Envío automático de voucher/confirmación al correo.

---

## 🛠️ Guía de Despliegue e Instalación Local

Sigue estos pasos detallados para levantar el ecosistema completo (DB + Back + Front) en tu entorno local.

### 📋 Prerrequisitos del Sistema
Asegúrate de tener instalado y configurado lo siguiente en tu `PATH`:
* **Java:** JDK 17 o superior (`java -version`).
* **Node.js:** v16.14.0 o superior (`node -v`).
* **Base de Datos:** MySQL Server 8.0+.
* **Gestor de Paquetes:** Maven 3.8+ (o usar el wrapper incluido `./mvnw`).

### 1. 🗄️ Configuración de Persistencia (MySQL)
Es necesario configurar el esquema y el juego de caracteres.
1.  Acceder a tu cliente MySQL (Workbench/DBeaver) y ejecutar:
    ```sql
    CREATE DATABASE reservaya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
2.  **(MUY IMPORTANTE)** Ejecutar el script de carga de datos iniciales ubicado en `/resources/data.sql` para tener usuarios y productos de prueba.
3.  Verificar credenciales en `src/main/resources/application.properties`:
    * `spring.datasource.url=jdbc:mysql://localhost:3306/reservaya_db`
    * `spring.datasource.username=root`
    * `spring.datasource.password=TU_PASSWORD`

### 2. ☕ Inicialización del Backend (Spring Boot)
**Desde la terminal en la raíz del proyecto:**
1.  **Limpiar y Compilar:**
    ```bash
    ./mvnw clean install
    ```
2.  **Ejecutar la Aplicación:**
    ```bash
    ./mvnw spring-boot:run
    ```
3.  El servidor iniciará en el puerto **8080**.

### 3. ⚛️ Inicialización del Frontend (React)
**Desde la terminal en la carpeta `/frontend`:**
1.  **Instalar Dependencias:**
    ```bash
    npm install --legacy-peer-deps
    ```
2.  **Levantar Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
3.  La aplicación estará disponible en `http://localhost:5173`.

---

### ⚠️ Solución de Problemas (Troubleshooting)

| Error | Causa Probable | Solución |
| :--- | :--- | :--- |
| **Port 8080 already in use** | Otro servicio ocupa el puerto. | Ejecuta `lsof -i :8080` (Mac/Linux) o cambia el puerto en `application.properties`. |
| **CORS Policy Error** | Bloqueo de seguridad del navegador. | Verifica la configuración `@CrossOrigin` o el filtro de seguridad en el Controller. |
| **Connection Refused** | MySQL detenido. | Revisa que el servicio de MySQL esté corriendo en Servicios. |

---

## 👥 Equipo de Desarrollo
* **Lautaro Bustos Roldan** - Full Stack Developer
