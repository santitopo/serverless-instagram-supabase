# InstaOrt

## Descripción

El sistema cuenta con las siguientes funcionalidades implementadas:

- **Registro de usuario**
  - Con email y contraseña
  - Con magiclink
- **Inicio de sesión:**
  - Con email y contraseña
  - Con magiclink
- **Cierre de sesión.**
- **Ver lista de posts (feed)**, mostrando para cada post su imagen, username, fecha de posteo. Así como también los likes y comentarios del post. Ordenada por fecha de creación y con paginado que muestre de a 5 items como máximo por página. 
- **Búsqueda de usuarios**, se puede buscar a otros usuarios registrados en la app, viendo de ellos el nombre completo, su username, email e imagen de perfil.
- **Ver perfil de usuario**, tanto propio como de otros usuarios.
- **Crear un post**, se puede crear un post desde la página de inicio, subiendo la imagen y la descripción de la misma.
- **Ver comentarios**, se pueden ver los comentarios de un post ordenados por fecha de creación y mostrando autor y contenido del mismo.
- **Crear comentario**, también se pueden agregar comentarios a los distintos posts.
- **Dar like/unlike**, se puede likear un post, asi también como quitar este like
- **Borrar post**, un usuario puede borrar los posts propios. 
- **Reporte de actividad / Rankings**, un usuario puede ver ciertos rankings dentro de la app, estos son: 
  - Top 5 usuarios con mayor cantidad de posts y su cantidad.
  - Top 5 posts con mayor cantidad de likes y su cantidad de likes.
  - Top 5 usuarios con mayor cantidad de comentarios y su cantidad.
- **Notificaciones de creación de post**, se le notifica a la ORT cada vez que se sube un post, esto es mediante una integración con Slack, donde se envía a un channel un mensaje cada vez que se crea un nuevo post.

El sistema cuenta con las siguientes cuestiones no funcionales:
- **Seguridad**, se cuenta con Row Level Security.
- **Configuración y manejo de secretos**, se trabaja con variables de entorno que se mantienen al margen del control de versiones.
- **Distribución del sistema**, el sistema es hosteado utilizando Firebase, específicamente su servicio de Firebase Hosting.
- **Código fuente**, el sistema fue desarrollado en su totalidad en inglés, además, se utilizó git como herramienta de control de versiones, siguiendo Gitflow como estrategia de branching. 


## Estructura de carpetas y archivos

- **src:** carpeta en la que se encuentra la mayor cantidad del contenido de la aplicación:
  - **pages:** carpeta con las paginas de la aplicación
  - **components:** carpeta con los componentes de la aplicacion
  - **providers:** se encuentra el provider de authentication de supabase
  - **supabase:** se encuentra el index de supabase
- **supabase**: allí se encuentran las functions, en específico la de integración con slack

## Ejecución del proyecto

Primero navegar hacia la carpeta raiz del proyecto.
Una vez en la raiz, se deben ejecutar los siguientes comandos para correr la aplicacion:

1.  `npm ci`
2.  `npm run start`


## Link publico

https://instagram-serverless.web.app
