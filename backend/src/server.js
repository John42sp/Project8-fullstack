const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT

const routes = require('./routes');

const app = express();
const server = require('http').Server(app); //para funcionar tanto http quanto websocket
const io = require('socket.io')(server);

//armazenando na memoria do proprio node, não recomendado em produção.
const connectedUsers = {
    //chave: "id de user452chcjcjc": valor: "id_do_socket"
}

io.on('connection', socket => {
    const { user } = socket.handshake.query;   //pra pegar o id de conexão la do Main.js (acesso ao id do user)
                                                
    console.log(user, socket.id);
//cada usuario que se conecta na app, precisoarmazenar id do user do banco, e sua relação com um ID de socket
//pra saber qual user esta conectado em qual socket, sempre saber id do sacket pra mandar menssagem p alguem
// a ser disponililizado no controller e frontend
//no frontend, precisosaber o id do socket  de ambos targetDev e logedDev caso estejam conectados
    connectedUsers[user] = socket.id;           //estamos pegando o id do usuário e do websocket dele, 

    console.log('Nova conexão', socket.id);

    // socket.on('hello', message => {       //teste de comunicação entre back e front end via websocket
    //     console.log(message);
    // })

    // setTimeout(() => {
    //     socket.emit('world', {
    //         message:'Lia-project!'
    //     })
    // }, 5000)

});

// Precisamos disponibilizar id user e websocket dele no controller, por um middleware. o next faz o fluxo seguir na app
app.use((req, res, next) => { 
    req.io = io;   //DANDO ACESSO DOS CONTROLLERS AO IO, SEM PRECISAR FAZER IMPORTAÇÃO NOS CONTROLLERS DE NOVO
    req.connectedUsers = connectedUsers; //REPASSANDO INFORMAÇÃO DE QUAIS USERS ESTÃO CONECTADOS NA APP

    return next();
});

/*conecção com banco de dados: */
// const db = process.env.MONGODB_URL || 'test'

// mongoose.connect(db, { useNewUrlParser: true})
mongoose.connect("mongodb+srv://liabackend:pandorga@cluster0-80fuo.mongodb.net/liabanco?retryWrites=true&w=majority", { useNewUrlParser: true,
useUnifiedTopology:'true'
})




app.use(cors());
app.use(express.json());
app.use(routes);

/*
server.get("/", (req, res)=>{
    res.send("oi")
})

server.get("/dados", (req, res)=>{
    res.send("aqui estãao seus dados")
})

server.get("/dados/sim", (req, res) => {
    res.send("sim sim sim")
})

server.get("/", (req, res) => {

    return res.json({message: `Hello ${req.query.name}`});
    
}); */

server.listen(port) // yarn dev p. rodar servidor
console.log("It's alive!!!")

// Arquitetura MVC: M - Model, V- View, C - Controller //
