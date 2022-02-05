import React from 'react'
import {View, Text, TouchableOpacity,  StyleSheet, Image,ImageBackground} from 'react-native'
import * as Interface from '../components/interface'
import {useSelector, useDispatch} from 'react-redux'


let encabezado = {name:'',direccion:'',condicion:'CONTADO'}

const image = require('../assets/Logo4.png')
const fondo = require('../assets/fondo.png')

function HomeScreen({ navigation }) {

  const user = useSelector(state => state.user)
  const accesos = useSelector(state => state.accesos)

  const dispatch = useDispatch();

  const irARemisiones = () =>{
    dispatch({type:'AGREGAR_REMISION', data:''})
    navigation.navigate('Remisiones',{encabezado:encabezado})

  }

  const buscarAcceso = () =>{   
    const resul = accesos.find(x => x.login == user[0].login)    
    return(resul)
  }

  return (
    <>      
      <View style={styles.container}>
          <ImageBackground source={fondo} style={styles.fondo}>
          <View style={[Interface.container,{paddingVertical:20}]}>
            <View style = {{flexDirection:'row',alignItems:'center',justifyContent:"center"}}>
              <View>
                <Image source={image} style={styles.image} />                          
              </View>
              <Text style={styles.text}>¡¡Bievenido a San Martin App!!</Text>
            </View>
          </View>      

          <View style={[Interface.container,{alignItems:"center",flex:1,marginBottom:15}]}>
            <TouchableOpacity onPress={() => irARemisiones()}>
              <Text style={Interface.boton}>Remisiones</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('ListaRemision')}>
              <Text style={Interface.boton}>Lista de remisiones</Text>
            </TouchableOpacity>            
            <TouchableOpacity onPress={() => navigation.navigate('InventarioNube')}>
              <Text style={Interface.boton}>Descargar inventario de la Nube</Text>
            </TouchableOpacity>

            {buscarAcceso() ?
            <>
              <TouchableOpacity  onPress={() => navigation.navigate('Extras')}>
                <Text style={Interface.boton}>Extras</Text>
              </TouchableOpacity>  
              <TouchableOpacity  onPress={() => navigation.navigate('Accesos')}>
                <Text style={Interface.boton}>Accesos</Text>
              </TouchableOpacity>  
              </>
              : null
            }

          </View>
          </ImageBackground>
      </View>
      
    </>
  );
}

const styles = StyleSheet.create({
  fondo:{
    flex:1,
  },
  container:{
    flex:1,
    backgroundColor:'white'   
  }, 
  image: {
    borderRadius:50,
    width: 100,
    height: 100,     
  },
  text:{    
    padding:10,
    fontWeight: 'bold',
    fontSize:25,
    color:'white',
    textAlign:"center",    
    marginLeft:15, 
    width:'70%',   
    borderRadius:10,
    backgroundColor:'#3F3DE0',
    borderColor:'white',
    borderWidth:2,

    /* shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.36,
      shadowRadius: 6.68,
      
      elevation: 11, */
  },   
})

  export default HomeScreen