import React, { useEffect, useState } from 'react';   /* useEffect,fazer chamada na api assim que componente for exibido                                                        em tela, toda vez que eu preci*/
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logolia from '../assets/logolia.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';


export default function Main( { match }) {    //para combinar, por exemplo, id na url com algo a exibir na tela: 
                                               // return ( <h1>{match.params.id}</h1>)   exibe id na tela
    
    const [ username, setUsername ] = useState('');
    const [ users, setUsers] = useState([ ]);
    const [ matchDev, setMatchDev ] = useState(null);         


    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            })
        console.log('outros devs')
        console.log(username);
        
        console.log(response.data);//*preciso armazenar este data em algum lugar onde meu componente possa ter acesso*/
                                        /* a estas informações pra mostrar em tela(usar conceito de estado:useState) */
        setUsers(response.data);
    }  
    
    loadUsers();
    
}, [match.params.id]);     

useEffect(() => {
    const socket = io('http://localhost:8080', {
        query: { user: match.params.id }            //enviando um 2º parâmetro (user id) pro backend na conexão
    });

    socket.on('match', dev => {             //ouvir o evento de 'match' (criado no backend - LikeControler)
        setMatchDev(dev);                   //quando recebo o match, tenho os dados do dev
    })                                      //agora o setMatchDev eh objeto que contem todas infos do dev
                                            //da pra usar matchDev varias vezes la embaixo
}, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: {user: match.params.id},
        })
        setUsers(users.filter(user => user._id !== id));
 };   
    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {user: match.params.id},
        })
        setUsers(users.filter(user => user._id !== id));
    };    
    
 
    return (                                  
        <div className="main-container">    
           < Link to="/">
                <img src={logolia}  alt="Lia"/>
          </ Link>
    <p>Bem vindo funalo...{username._id} </p>
         <p>Voce tem <strong>{users.length}</strong> integrantes no seu perfil.</p> 
            { users.length > 0 &&
                <ul>
                {users.map(user => 

                    <li key={user._id}>
                        <img src={user.avatar} alt={user.name}/>
                        <footer >
                            <strong>Login: {user.user}</strong>
                            <strong>Nome: {user.name}</strong>
                            <p>{user.bio}</p>
                        </footer>
                        <div className="buttons">
                            <button type="button" onClick={ () => handleLike(user._id)} >
                                <img src={like} width='32px' alt="Like" />
                            </button>

                            <button type="button" onClick={ () => handleDislike(user._id)} >
                                <img src={dislike} width='32px' alt="Dislike" />
                            </button>

                        </div>
                    </li>
            )}                
               
            </ul>
            }{
                (users.length === 0) &&
                <div className="empty">Acabou :( {users.length}  </div>
            }

             { matchDev && (
                 <div className='match-container'>
                        <br></br>
                    <img src={itsamatch} alt='Its a match!'/>
                    
                    <img className='avatar' src={matchDev.avatar}/>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>

                    <button type="button" onClick={ () => setMatchDev(null)}>FECHAR</button>


                </div>

             )
             
             }  
              

        </div>             
    )
}
