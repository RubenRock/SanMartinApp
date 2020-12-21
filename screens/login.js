import React from 'react'
import {View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity} from 'react-native'
import * as Interface from '../components/interface'

const fondo = require('../assets/fondo.png')

function LoginScreen (props) {    
    console.log(props)
    return(
        <View style = {{flex:1}}>
            <ImageBackground source={fondo} style = {styles.container}>
                <View style={styles.container2}>
                    <Text style= {styles.text}> INICIAR SESION  </Text>
                    <TextInput secureTextEntry={true} placeholder='Contraseña' style={[styles.input,styles.text]}/>
                    <TouchableOpacity  onPress={ () => console.log('me pushaste')}>
                        <Text style={[Interface.boton,{marginTop:5,width:"100%"}]}>Aceptar</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={{marginTop:10}} onPress={() => console.log('haaa keres crear uno')}>
                        <Text>Nuevo usuario</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>    
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    text:{        
        color:Interface.colorText,
        fontWeight:"bold",
        fontSize:20,
        },

    container2:{          
        alignSelf:'stretch',
        marginHorizontal:10,     
        backgroundColor:'rgba(4,119,224,0.2)',
        borderRadius:10,
        padding:8, 
        textAlign:'center',
        height:250,   
        justifyContent:'center',
        },

    input:{            
        marginTop:50,
        borderBottomWidth:2,
        borderColor:'white',
        marginBottom:10
    },
})

export default LoginScreen