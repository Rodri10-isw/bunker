const { Server } = require("net");
const server = new Server();


server.listen({ port: 8000 }, () => {
     console.log("escuchando en el puerto 8000");
});
