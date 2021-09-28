const { Server } = require("net");
const server = new Server();
const adminFb = require("firebase-admin");
var cuentaFB = require("./permis.json");
const { error } = require("console");

adminFb.initializeApp({
     credential: adminFb.credential.cert(cuentaFB),
     databaseURL: "https://gpsnanetr-default-rtdb.firebaseio.com"
});
const db = adminFb.firestore();

async function consulta(data) {
     const bk = "bk";
     var snapshot = await db.collection('client').where(bk + data[1], '==', true).get();
     if (snapshot.empty) {
          console.log('Usuario no encontrado');
     }
     snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
     });
     const info = snapshot.docs[0];
     const docId = info.id;
     return docId;
}

async function realtime(data, idUser) {
     const dataDB = {
          lat: parseFloat(data[13]),
          lon: parseFloat(data[14]),
          SPD: data[15],
          IN_STATE: data[19],
          MODE: data[21],
     };
     if (data[0] === "STT" || data[0] === "ALT") {
          var res = await db.collection('client').doc(idUser).collection('units').doc(data[1]).set(dataDB);
          return idUser;
     } else {
          var res = "Dispositivo invalido";
          return idUser;
     }
}
async function history(data, idUser) {
     var res;
     var myDate = new Date();
     hours = myDate.getHours();
     minutes = myDate.getMinutes();
     seconds = myDate.getSeconds();
     var timpoSave = hours + ":" + minutes + ":" + seconds;
     //console.log(hours + ":" + minutes + ":" + seconds)
     const hydata = {
          HDR: data[0],
          DEV_ID: data[1],
          REPORT_MAP: data[2],
          MODEL: data[3],
          SW_VER: data[4],
          MSG_TYPE: data[5],
          DATE: data[6],
          TIME: data[7],
          CELL_ID: data[8],
          MCC: data[9],
          MNC: data[10],
          LAC: data[11],
          RX_LVL: data[12],
          LAT: parseFloat(data[13]),
          LON: parseFloat(data[14]),
          SPD: data[15],
          CRS: data[16],
          SATT: data[17],
          FIT: data[18],
          IN_STATE: data[19],
          OUT_STATE: data[20],
          MODE: data[21],
          STT_RPT_TYPE: data[22],
          MSG_NUM: data[23],
          //reserved: data[23],
          ASSIGN_MAP: data[24],
          S_ASSIGN1: data[25],
          TIME_SERVER: timpoSave,
     };
     if (data[0] === "STT") {
          //var res = await db.collection('client').doc(data[1]).set(dataDB);
          res = await db.collection('client').doc(idUser).collection('units').doc(data[1]).collection('STT').doc().set(hydata);
          return 'Save history STT';
     } else {
          if (data[0] === "ALT") {
               res = await db.collection('client').doc(idUser).collection('units').doc(data[1]).collection('ATL').doc().set(hydata);
               return "Save history ALT";
          } else {
               return "Dispositivo invalido";
          }
     }
}
server.on("connection", (socket) => {
     console.log('Nueva coneccion de: ', socket.remoteAddress + " " + socket.remotePort);
     socket.setEncoding("utf-8");
     socket.on("data", (data) => {
          console.log(data);
          var cadena = data;
          var arrayDeCadenas = cadena.split(";");
          /* for (var i = 0; i < arrayDeCadenas.length; i++) {
                console.log("Cadena " + [i] + ": " + arrayDeCadenas[i]);
           }*/
          try {
               consulta(arrayDeCadenas)
                    .then(qr => {
                         realtime(arrayDeCadenas, qr)
                              .then(rt => {
                                   //console.log(rt);
                                   history(arrayDeCadenas, rt)
                                        .then(hy => {
                                             console.log(hy);
                                        });
                              });
                    }).catch(e => {
                         console.log(e);
                    });

          } catch (error) {
               console.log("Hay un error **** *** *** ** " + error);
          }
     });
     socket.on("close", () => {
          console.log("Dispositivo fuera del server" + socket.remoteAddress)
     });
});

server.listen({ port: 8080 }, () => {
     console.log("Server en el puerto 8080");
})
