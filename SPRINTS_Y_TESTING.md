# Reporte de Evolución del Proyecto - ReservaYa
**Alumno:** Lautaro Bustos

## 📅 Detalle de Sprints (Metodología de Trabajo)

### Sprint 1: Base de Datos y Configuración Inicial
* **Objetivo:** Establecer la arquitectura base del proyecto y la persistencia de datos.
* **Tareas completadas:**
    * Diseño del Modelo de Entidad-Relación (DER) para la base de datos MySQL.
    * Configuración inicial del proyecto Spring Boot (Backend).
    * Creación de las primeras entidades JPA (Usuario, Producto/Alojamiento, Categoría, Ciudad).
    * Conexión exitosa entre la API y la base de datos MySQL.

### Sprint 2: Desarrollo del Backend y API REST
* **Objetivo:** Crear la lógica de negocio y exponer los endpoints necesarios.
* **Tareas completadas:**
    * Desarrollo de las capas Repository, Service y Controller.
    * Implementación del CRUD completo para Productos y Categorías.
    * Configuración de Spring Security y Autenticación con JWT.
    * Diferenciación de roles (ROLE_ADMIN vs ROLE_USER) en los endpoints.
    * Pruebas de endpoints utilizando Postman.

### Sprint 3: Frontend e Integración
* **Objetivo:** Construir la interfaz de usuario y conectarla con el servidor.
* **Tareas completadas:**
    * Configuración del proyecto React + Vite.
    * Maquetado de componentes principales: Header, Footer, Cards de productos.
    * Desarrollo de páginas clave: Home, Login, Registro y Detalle del Producto.
    * Integración de la API (fetch) para mostrar datos dinámicos desde el Backend.
    * Manejo de estado global (Context API) para la sesión del usuario.

### Sprint 4: Refinamiento y Funcionalidades Finales
* **Objetivo:** Pulido final, flujo de reservas y panel de administración.
* **Tareas completadas:**
    * Implementación del flujo de Reservas (validación de fechas disponibles).
    * Desarrollo del Panel de Administración para la creación de productos.
    * Ajustes visuales y correcciones de estilos (CSS/Responsive).
    * Implementación de validaciones en formularios (Frontend y Backend).
    * Preparación de documentación y README.

---

## 🧪 Anexo: Plan de Pruebas Manuales (Testing)

**Objetivo:** Verificar el correcto funcionamiento de los flujos principales de la aplicación ReservaYa.

**🔑 Credenciales de Acceso (Administrador)**
Para realizar las pruebas de administración y creación de productos, utilice:

* **Usuario:** lautaro.bustosroldan@gmail.com
* **Contraseña:** Roldan12


**1. Caso de Prueba: Registro e Inicio de Sesión**
* **Acción:** Ingresar a "Crear cuenta", completar formulario con datos válidos y enviar. Luego, intentar "Iniciar sesión" con esas credenciales.
* **Resultado Esperado:** El sistema registra al usuario, permite el login y redirige al Home mostrando las iniciales del usuario en el Header.
* **Estado:** ✅ Aprobado.

**2. Caso de Prueba: Búsqueda de Productos**
* **Acción:** En el Home, seleccionar una ciudad y un rango de fechas en el buscador y dar clic en "Buscar".
* **Resultado Esperado:** El listado de productos se actualiza mostrando solo aquellos disponibles en esa ciudad y fechas.
* **Estado:** ✅ Aprobado.

**3. Caso de Prueba: Acceso Restringido (Seguridad)**
* **Acción:** Intentar ingresar a la ruta `/administracion` sin estar logueado o estando logueado con un usuario normal (Rol USER).
* **Resultado Esperado:** El sistema deniega el acceso y redirige al Home o al Login, ya que es una ruta protegida solo para ADMIN.
* **Estado:** ✅ Aprobado.

**4. Caso de Prueba: Creación de Producto (Validaciones)**
* **Acción:** Ingresar al Panel de Administración (como Admin), intentar guardar un producto dejando campos vacíos o con precios negativos.
* **Resultado Esperado:**
    * El navegador muestra alertas de "Completa este campo".
    * El sistema muestra un mensaje de error global indicando qué datos faltan.
    * No se crea el producto en la base de datos hasta que los datos sean correctos.
* **Estado:** ✅ Aprobado.

**5. Caso de Prueba: Flujo de Reserva**
* **Acción:** Ingresar al detalle de un producto, seleccionar fechas disponibles en el calendario y hacer clic en "Iniciar Reserva".
* **Resultado Esperado:** Se redirige al usuario a la página de confirmación con los datos del producto y, al confirmar, la reserva se guarda correctamente.
* **Estado:** ✅ Aprobado.
