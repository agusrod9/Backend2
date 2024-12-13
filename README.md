# [![CoderHouse](https://www.coderhouse.com/imgs/ch.svg)](https://www.coderhouse.com/)

Programación Backend II: Diseño y Arquitectura Backend 70280<br>
Proyecto: Continuación del [proyecto de Backend 1](https://github.com/agusrod9/Backend1-PE1.git)

-PARA PROBAR: <br>
-https://drive.google.com/drive/folders/1YvCORLJgicKoEHuY4cYXDqb-tlUlI6Ka?usp=sharing
<br>
-Para probar las vistas, ingresar a localhost:8085 - El sistema redirigirá hacia login o register<br>
-Para probar con usuario Admin utilizar el ya creado testadmin@test.com con pass1234 como password <br>
-Para probar con usuario Admin utilizar el ya creado testuser@test.com con pass1234 como password <br>
<br>
-Adjunto proyecto Postman <br>
-Adjunto archivo de variables de entorno (.env) <br>

Entrega Final:<br>

Comentarios: <br>
-Implemento ambientes: DEV-TEST-PROD<br>
-Implemento Commander<br>


Pre-entrega 1:<br>

Comentarios: <br>
<br>
-Soluciono problema con sweet alert que dejó de funcionar en Login y realtimeproducts<br>
-Soluciono problema con los socket emit que no permitía ver productos en tiempo real<br>
-Implemento VISTA Home con menú, resta funcionalidad menú<br>
-Implemento register con google desde vista register<br>
-Implemento login con google desde vista login<br>
-Implemento VISTAS Login y Register<br>
-Implemento estrategia passport-jwt para endpoints de session router : -isOnline -logout -isAdmin <br>
-implemento cookie con el token, con la estrategia que ya tengo de passport local + jwt<br>
-Modifico todos los endpoint de sessions, para utilizar token en vez de session<br>
-Implemento jwt para crear y verificar tokens en session router<br>
-Agrego control de usuario administrador a las rutas de Productos y Carts necesarias. <br>
-Implemento middleware isAdminVerifier para utilizar en los CRUD - (no utilizo passport, hasta ahora no lo veo necesario) <br>
-Implemento estrategia de Google - como una opción más de registro y login <br>
-Implemento Passport-Local con email y password.<br>
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