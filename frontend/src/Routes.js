import React from 'react';

import {BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

export default function Routes() {    /*exportar este componente */
    return (                    /*chave <BrowserRouter> vai em volta de todas rotas */
                                /* por padrão, o react-router-dom naõ verifica a sequencia na instrução de url e barras //, o 'exact' faz isto acontecer, sempre a partir do root: '/'  */
                                /* <Route path="/main" component={Main} /> */
        <BrowserRouter>  
            <Route path="/" exact component={Login} />              
            <Route path="/dev/:id" component={Main} />       
        </BrowserRouter>
    );
}