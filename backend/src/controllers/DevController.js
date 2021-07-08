const axios = require('axios');
const Dev = require('../models/Dev')
                                                        //dica: async - await: para operações que demoram um pouco //
module.exports = {
    async index(req, res) {                   //metodo index, para listagem (dos 3 filtros): usuarios nao logados,                                                   ou logados que nao deram likes nem dislikes.//
        const { user } = req.headers;       //id de busca de usuário logado//

        const loggedDev = await Dev.findById(user);   //pegar a instância deste usuário logado//
                                                        //agora eu já tenhos todos dados dos usuários que  ja deram like e dislike//
        const users = await Dev.find({       //agora buscar dentro da base de dados todos usuários que não estão                                               logados, ou logados que não deram likes nem dislikes.//
           $and: [                          //condição deve passar nos 3 filtros ('$and') para aplicar 3 filtros de 1                                          vez so//
               { _id: { $ne: user } },        //operador  'ne' = 'not equal', pra verificar desigualdade: busca todos                                    ids diferentes deste 'user'//
               { _id: { $nin: loggedDev.likes } },  //$nin = 'não esteja" dentro de uma lista. Pra excluir todos                                                 usuarios que ja deram like//
               { _id: { $nin: loggedDev.dislikes } },  //pros dislikes//
           ],                                          // estas 3 querys so retornará todos os usuários que o usuário                                                      logado ja deu like, dislike, e que nao seja o mesmo                                                             usuario logado//
        })
        return res.json(users);
    },

    async store(req, res) {        
        const { username } = req.body; // ou console.log(req.body.username);//
        console.log(username)
        const userExists = await Dev.findOne({ user: username}); // função para verificar se usuário nao esta repetido//
        if (userExists) {                                          //ver se o uruário já existe na database //
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar  } = response.data;
        const dev = await Dev.create({
            name, 
            user: username,
            bio, 
            avatar
        })
                                            console.log(response.data);//
        return res.json(dev);    //return res.json({ ok: true}); //
    }
}