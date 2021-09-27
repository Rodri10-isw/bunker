const { Server } = require("net");
const server = new Server();


server.listen({ port: 8080 }, () => {
     console.log("escuchando en el puerto 8080");
});
