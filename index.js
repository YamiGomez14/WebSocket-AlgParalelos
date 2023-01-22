
const cluster = require('node:cluster');
const totalCPUs = require('node:os').cpus().length;
const process = require('node:process');
const WebSocketServer = require('ws');
 


if (cluster.isMaster) {
  console.log(`Numeros de CPU ${totalCPUs}`);
  console.log(`Principal ${process.pid} corre`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} muerto`);
    cluster.fork();
  });

} else {
  Inicio();
}

function Inicio() {

// creando el nuevo websocket
const webso = new WebSocketServer.Server({ port: 8080 })
 
// Creando la conexion
webso.on("connection", ws => {
    console.log("Nuevo Cliente conectado");
    // Para enviar un msj
    ws.on("message", data => {
        console.log(`El cliente envio lo siguiente: ${data}`)
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("El cliente se ha desconectado");
        process.exit();
    });
    // error de conexion
    ws.onerror = function () {
        console.log("Ha ocurrido un error inesperado")
    }
});

}