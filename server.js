const { Server } = require("net");
const server = new Server();
server.on("connection", (socket) => {
     console.log('Nueva coneccion de: ', socket.remoteAddress + " " + socket.remotePort);
     socket.setEncoding("utf-8");
     socket.on("data", (data) => {
          console.log(data);
          var cadena = data;
          var arrayDeCadenas = cadena.split(";");
          for (var i = 0; i < arrayDeCadenas.length; i++) {
                console.log("Cadena " + [i] + ": " + arrayDeCadenas[i]);
           }
     });
});

server.listen({ port: 8080 }, () => {
     console.log("escuchando en el puerto  gps 8000");
});
