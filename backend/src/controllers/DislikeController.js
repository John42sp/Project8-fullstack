const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        //console.log(req.params.devId);//     //qual o desenv. que ta dando o like em alguem, e recebendo likes...//
        //console.log(req.headers.user);//

        const { devId } = req.params;
        const { user } = req.headers;
        
        const loggedDev = await Dev.findById(user);   //para encontrar o usuario logado pelo ID //
        const targetDev = await Dev.findById(devId);   //ambos guardam a instância dos usuários dentro do banco dados//
        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists'});
        }
        
        loggedDev.dislikes.push(targetDev._id);
        await loggedDev.save();
        return res.json(loggedDev);
    }
};