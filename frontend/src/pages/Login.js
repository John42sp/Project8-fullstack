import React, { useState } from 'react';
import  './Main.css';
import  './Login.css';
import api from '../services/api';

import logolia from '../assets/logolia.svg';


export default function Login( {history} ) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log('bolinha de queijo')
        console.log(username)
        const response = await api.post('/devs', {  //deve ser post(registrar usuário) e restante da URL (/devs).
            username,                    // pode usar somente 'username;' por nome ser = valor .
        }); 
        console.log(response)
        console.log(response._id)

        const { _id } = response.data;  // passar id do usuario pra rota main
        
        history.push(`/dev/${_id}`);   //propriedade faz o redirecionamento
                                    //colocará o id do usuário na url: http://localhost:3000/dev/5d65366301098f1fd0506da5
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} >                
                <h1><img src={logolia} alt="Lia" width="100px" /></h1>
                <input 
                placeholder="Digite seu usuário no Github"
                value={username}
                onChange={ e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
            
        </div>

        
    );
}



/* ou export default Login;  */
