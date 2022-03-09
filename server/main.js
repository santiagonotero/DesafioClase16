let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

const prodMethod = require('../models/productos')
const msgMethod = require('../models/mensajes')

app.use(express.static("public"));

let messagePool={}
let productList={}

//Iniciamos las bases de datos
msgMethod.init()
prodMethod.init()

msgMethod.readData().then((info)=>{
  messagePool = info
})

prodMethod.readData().then((info)=>{
  productList = info
})

// iniciamos la conexión del socket
io.on("connection", function (socket) {   //Mensaje que indica una conexión. 
  console.log("Un cliente se ha conectado")

  socket.emit("messages", messagePool)
  socket.emit('server:productList', productList)

  socket.on('new-message', (data)=>{  // Mensaje que indica un nuevo mensaje de chat recibido
      messagePool.push(data)
      msgMethod.appendMessage(data)  // Almacenar mensaje en la base de datos
      io.sockets.emit("messages", messagePool)
    })

    socket.on('new-product', (prodInfo)=>{ //Mensaje que indica un nuevo producto agregado al stock de productos
        prodInfo.price = JSON.parse(prodInfo.price)
        productList.push(prodInfo)
        prodMethod.appendProduct(prodInfo) // Almacenar nuevo producto en la base de datos
        io.sockets.emit('server:productList', productList)
    })    
    
});

server.listen(8080, function () {
    console.log("Servidor corriendo en http://localhost:8080");
  });

