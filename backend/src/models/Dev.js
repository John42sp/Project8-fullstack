const { Schema, model } = require('mongoose');

//objetos de configuração: estrutura da tabela para armazenar informação no banco de dados (MODEL): //
const DevSchema = new Schema({
   name: {
       type: String,
       /*required: true,*/
   },
   user: {
        type: String,
        required: true,
   },
   bio: String,
   
   avatar: {
       type: String,
       required: true,
   },
   likes: [{                             //vetor(colchetes): para referenciar vários desenvolvedores ali dentro. //
    type: Schema.Types.ObjectId,
    ref: 'Dev',
   }],
   dislikes: [{
       type: Schema.Types.ObjectId,
       ref: 'Dev',
   }],
}, {
    timestamps: true,
})

//timestanmpas cria colunas  createdAt , updatedAt//

module.exports = model('Dev', DevSchema);