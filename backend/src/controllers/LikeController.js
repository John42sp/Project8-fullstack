const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        console.log(req.io, req.connectedUsers); //acesso destas variaveis setadas no server.js 
        
        //console.log(req.params.devId);//     //qual o desenv. que ta dando o like em alguem, e recebendo likes...//
        //console.log(req.headers.user);//

        const { devId } = req.params;
        const { user } = req.headers;
        
        const loggedDev = await Dev.findById(user);   //para encontrar o usuario logado pelo ID //
        const targetDev = await Dev.findById(devId);   //ambos guardam a instância dos usuários dentro do banco dados//
        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists'});
        }
        if (targetDev.likes.includes(loggedDev._id)) { //para buscar a conexão de socket ativa entre usuário
        //req.connectedUsers = são os usuáriosconectados(vem com socket id), que contenha o id do user logado
            const loggedSocket = req.connectedUsers[user];            
            const targetSocket = req.connectedUsers[devId]; 
            if (loggedSocket) {  //se estiver locado na applicação
                req.io.to(loggedSocket).emit('match', targetDev);
            }
            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }

        }
        loggedDev.likes.push(targetDev._id);
        await loggedDev.save();
        return res.json(loggedDev);
    }
};