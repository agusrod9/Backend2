# [![CoderHouse](https://www.coderhouse.com/imgs/ch.svg)](https://www.coderhouse.com/)

Programación Backend II: Diseño y Arquitectura Backend 70280

Pre-entrega 1 - Continuación del [proyecto de Backend 1](https://github.com/agusrod9/Backend1-PE1.git)

Comentarios: <br>
-implemento cookie con el token, con la estrategia que ya tengo de passport local + jwt<br>
-Modifico todos los endpoint de sessions, para utilizar token en vez de session<br>
-Implemento jwt para crear y verificar tokens en session router<br>
-Agrego control de usuario administrador a las rutas de Productos y Carts necesarias. <br>
-Implemento middleware isAdminVerifier para utilizar en los CRUD - (no utilizo passport, hasta ahora no lo veo necesario) <br>
-Implemento estrategia de Google - como una opción más de registro y login <br>
-Implemento Passport-Local con email y password.<br>
-***VER LOS SOCKET EMIT DE PRODUCT ROUTER PARA LA VISTA REAL TIME QUE NO ESTAN ANDANDO*** <br>
-REFACTOR DE PRODUCT MANAGER, PRODUCT MODEL y PRODUCT ROUTER <br>
-Refactor del router de Carts <br>
-Refactor del manager de Carts <br>
-Refactor de los Managers, creo un Manager general <br>
-QUITO FILESYSTEM de Products y Carts<br>
-Implemento session con connect-mongo (A REEMPLAZAR LUEGO CON JWT cuando lo veamos en clase) <br>
-Implemento enrutador de sessions con Register - Login - Logout - Online<br>
-Implemento enrutador de cookies <br>
-Implemento usersModel y userManager <br>
-Implemento pathHandler y errorHandler<br>
-Implemento dotenv y migro puerto y uris de Mongo a un .env