# [![CoderHouse](https://www.coderhouse.com/imgs/ch.svg)](https://www.coderhouse.com/)

Programación Backend I: Desarrollo Avanzado de Backend
#70275

Pre-entrega 1

Comentarios:

-Entrego en condiciones de ejecutar por primera vez, instanciando lo que son los JSON y archivos txt auxiliares para manejar los Id de products y de carts.<br>
-A modo de simplificar la tarea de corrección, entrego 2 JSON de pruebas con carts y products ya persistidos.<br>
-Un comentario, en los products, el borrado entiendo debería en un caso real ser lógico, manteniendo toda la inforamción y simplemente cambiandole un estado. Pero para esta entrega entendí que debíamos realizar el borrado permanente. De no ser así avisarme y lo implemento, entiendo que sería el mismo nivel de complejidad.<br>


Pre-entrega 2

Comentarios:

-Se agregan las vistas /view y /realtimeproducts<br>
-La vista /realtimeproducts implementa websockets, por lo que se visualiza e tiempo real el alta y baja de productos.<br>
-ALTA DE PRODUCTO -> Continúa disponible desde el server http únicamente, es necesario utilizar Postman para probar la funcionalidad.<br>
-BAJA DE PRODUCTO -> Continúa disponible desde el server http, pero para esta entrega se agregan botones en vistas /view y /realtimeproducts para probar la funcionalidad desde ahí también.<br>


ENTREGA FINAL

Comentarios:

-Implemento bd MongoDB, con las colecciones users, carts y products. Un documento de carts sería la asociación de 1 user a N products.<br>
-Implemento conexión mediante Mongoose.<br>
-Mantengo funcionalidad de lectura y escritura de archivos comentada, se descomenta y se puede utilizar alternando con la base de datos.<br>
-Implemento cambio en los carts para que esten asociados a un user al crearlos vacios. obeniendo user como parámetro en la query. Para el Filesystem no lo implemento. <br>
-Implemento endopint para el put de producto al carrito. Recibe productId en el body y si ya existe en el carrito le suma 1 a la qty, sinó lo agrega con qty:1 . <br>
-Implemento funcionalidad de botón de agregar al carrito en cada producto de Las listas de productos, la realtime y la básica.<br>
-Implemento requermientos en el get de products: limit, page, query, sort . <br>
-Implemento paginación. <br>
-Implemento la vista cart, donde despliega los productos que hay en un carrito dado (por id de carrito).<br>