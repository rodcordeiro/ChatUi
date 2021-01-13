const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname,'public')));

app.set('views',path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/',(req, res)=>{
  res.render('index.html', {port:10})
})


let messages = [];
let users = [];

io.on('connection', socket => {
  socket.on("registerUser",data => {
    data.id = socket.id
    users.push(data)
    socket.broadcast.emit('newUser',data);
  })

  socket.emit('previowsMessages',messages);
  socket.emit('previowsUsers',users);
  
  socket.on("sendMessage",data=>{
    messages.push(data);
    socket.broadcast.emit("receivedMessage",data);
  })

//   socket.on('disconnect').broadcast.emit('disconected',socket.id)

})

server.listen(port);


// REFERENCIA
// enviar apenas para o cliente atual
// client.emit('message', "this is a test");
//
// // enviar para todos os clientes, inclusive o atual
// io.emit('message', "this is a test");
//
// // enviar para todos os clientes, exceto o atual
// client.broadcast.emit('message', "this is a test");
//
// // enviar para todos os clientes (com exceção do atual) para uma sala específica
// socket.broadcast.to('game').emit('message', 'nice game');
//
// // enviar para todos os clientes em uma sala específica
// io.in('game').emit('message', 'cool game');
//
// // enviar para o atual, caso ele esteja na sala
// client.to('game').emit('message', 'enjoy the game');
//
// // enviar para todos os clientes em um namespace 'namespace1'
// io.of('namespace1').emit('message', 'gg');
//
// // enviando para um socketid individual
// client.broadcast.to(socketid).emit('message', 'for your eyes only');
