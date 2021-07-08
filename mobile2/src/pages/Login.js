import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, StyleSheet, Platform, Image, TextInput, Text, TouchableOpacity } from 'react-native';
import api from '../services/api';

import logo from '../assets/logolia.png';

export default function Login({ navigation }) {
    const [ user, setUser ] = useState('');

    useEffect(() => { 
        AsyncStorage.getItem('user').then(user => {
           if (user) {
               navigation.navigate('Main', { user }) //se tem user, passa p/tela main com este user
           }
        })
    }, []); 

    async function handleLogin() {
        const response = await api.post('/devs', { username: user });  

        const { _id } = response.data;     
       
        await AsyncStorage.setItem('user', _id); //armazeno uma info no storage da aplicação chamada usuário, com id dele
        
        navigation.navigate('Main', { user: _id });  //passa pra tela main com este usuario logado

    }
    return (
            <KeyboardAvoidingView 
            bahavior="padding"
            enable={Platform.OS==='ios'} 
            style={styles.container} >

                <Image source={logo} />
                
                <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                placeholder= "Digite seu usuário no Github"
                placeholderTextColor="#999"
                style={styles.input}
                value={user}
                onChangeText={setUser}

                />

                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
     

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent:'center',
        alignItems:'center',
        padding: 30
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor:'#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor:'#df4723',
        borderRadius:4,
        marginTop:10,
        paddingHorizontal:15,
        justifyContent:'center',
        alignItems:'center'

    },

    buttonText: {
        color:'#fff',
        fontWeight:'bold',
        fontSize:16
    }   

});