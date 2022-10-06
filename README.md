# Serverless Chat

## Descirpción

El sistema cuenta con las siguientes funcionalidades implementadas:

- Registro de usuario con mail, Google y Facebook.
- Inicio de sesión con mail, Google y Facebook.
- Enviar solicitud de amistad, tanto a usuarios registrados como no registrados. Estos ultimos reciben una invitacion por correo electronico a unirse a la aplicacion.
- Manejo de solicitudes de amistad. Los usuarios pueden rechazar y aceptar las solicitudes.
- Conversaciones con amigos. Se listan los usuarios que son amigos del usuario loggeado, y cuando se selecciona uno, se muestra el chat entre ambos.
- Ver ultimo mensaje en la lista de amigos.
- Notificaciones dentro de la app al recibir mensajes.

## Estructura de carpetas y archivos

- extensions y requests: carpetas que contienen las credenciales para hacer uso del envio de mails para invitaciones al sistema
- src: carpeta en la que se encuentra la mayor cantidad del contenido de la aplicación:
  - pages: carpeta con las paginas de la aplicación
  - components: carepta con los componentes de la aplicacion
- tests: caperta contenedora de los test de la aplicacion

## Ejecución del proyecto

Primero navegar hacia la carpeta raiz del proyecto.
Una vez en la raiz, se deben ejecutar los siguientes comandos para correr la aplicacion:

1.  `npm ci`
2.  `npm start`

## Ejecución de pruebas

En la raíz del proyecto ejecutar `firebase emulators:start`
En otra consola, en la raíz del proyecto ejecutar:

1. `cd tests`
2. `npm ci`
3. `npm test`
