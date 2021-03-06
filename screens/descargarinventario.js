import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert,ImageBackground,Button  } from 'react-native'
import * as SQLITE from 'expo-sqlite'
import * as Interface from '../components/interface'
import MiModal from '../components/mimodal'
import {useDispatch, useSelector} from 'react-redux'
import NetInfo from '@react-native-community/netinfo';
import { ActivityIndicator } from 'react-native-paper';



const db = SQLITE.openDatabase("db.db");



const borrartodoSql = () => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from inventario;`, [])        
        tx.executeSql(`delete from empaques;`, [])        
        tx.executeSql(`delete from listasimilar;`, [])
        tx.executeSql(`delete from similares;`, [])
      },
      (e) => console.log(e.message),//error
      () => console.log('Borrado'))// exito
    
     
  }

function DescargarInventario (){    

    const dispatch = useDispatch()
  
    const [dataInventario, setDataInventario] = useState() //miarroba
    const [dataEmpaque, setDataEmpaque] = useState() //miarroba
    const [dataListaSimilar, setDataListaSimilar] = useState() //miarroba
    const [dataSimilar, setDataSimilar] = useState() //miarroba
    const [modalVisible, setModalVisible]= useState(false)    
    const [progress, setProgress] = useState(0)
    const [envioCompleto, setEnvioCompleto] = useState(false)

    

     //llenar db local y Redux con los datos de la nube    
    const agregarSql = () => {        
        db.transaction(
          tx => {       
            let empaque =''
            dataInventario.forEach(
                (ele) => tx.executeSql("insert into inventario (clave, producto, iva, usuario, fecha , ieps) values (?, ?, ?, ?, ?, ?)", [ele.clave, ele.producto, ele.iva, ele.usuario, ele.fecha, ele.ieps])                
            )
            setProgress(0.5)

            dataEmpaque.forEach(
              ele => {
                //ele.empaque == '6' ? empaque='SEIS' : ele.empaque == '12' ? empaque='DOCE' : empaque= ele.empaque                
                tx.executeSql("insert into empaques (clave, empaque, precio, piezas, barras , id) values (?, ?, ?, ?, ?, ?)", [ele.clave, ele.empaque, ele.precio, ele.piezas, ele.barras, ele.id])
              }
            )
            setProgress(0.7)
            
            dataListaSimilar.forEach(
              (ele) => tx.executeSql("insert into listasimilar (clave, descripcion) values (?, ?)", [ele.clave, ele.descripcion])                
            )
            setProgress(0.85)

            dataSimilar.forEach(
              (ele) => tx.executeSql("insert into similares (clave, producto) values (?, ?)", [ele.clave, ele.producto])                
            )   

            llenarRedux()
            setProgress(1)
            setEnvioCompleto(true)

          },(e) =>  Alert.alert(   //error
            "Error",
            e.message,
            [              
              { text: "Cerrar" }
            ],
            { cancelable: false }
          )
          )
      }

    const llenarRedux = () => {
      dispatch({type:'CARGAR_INVENTARIO',data:dataInventario})
      dispatch({type:'CARGAR_EMPAQUE',data:dataEmpaque})
      dispatch({type:'CARGAR_SIMILAR',data:dataSimilar})
      console.log('termino Redux')     
    }

       

    useEffect(() => {
      const fetchInventario = async () => {       
        const response = await fetch('https://vercel-api-eta.vercel.app/api/inventario' )
        
        const data = await response.json()  
        if (response.status != 200){
          alert(response.status)
        }
        setDataInventario(data)        
      }

      const fetchEmpaque = async () => {       
        const response = await fetch('https://vercel-api-eta.vercel.app/api/empaque' )
        
        const data = await response.json()       
        setDataEmpaque(data)        
      }

      const fetchListaSimilar = async () => {       
        const response = await fetch('https://vercel-api-eta.vercel.app/api/listasimilar' )
        
        const data = await response.json()       
        setDataListaSimilar(data)        
      }

      const fetchSimilar = async () => {       
        const response = await fetch('https://vercel-api-eta.vercel.app/api/similares' )
        
        const data = await response.json()       
        setDataSimilar(data)                
      }


      fetchInventario()
      fetchEmpaque()
      fetchListaSimilar()
      fetchSimilar()
    },[])   

    const handleBoton= () =>{
      NetInfo.fetch().then(state => {
        console.log(state)
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);

        if (state.isConnected){
          setProgress(0)
          setEnvioCompleto(false)
          setModalVisible(true)
          borrartodoSql()
          setProgress(0.3)
          agregarSql()  
        }else alert('no hay conexion a internet')
      })

         
    }

   

return(          
    <ImageBackground source={Interface.fondo} style={{flex:1, justifyContent:"center",}}>
       <MiModal visible={modalVisible} progress={progress} title='Descargando datos de la nube'>
                                          
          {envioCompleto ?                                      
              <View style={styles.button}>                
                <Button title='Completo'  onPress={() => setModalVisible(false)}></Button>                  
              </View>
            : 
              <View style={{marginTop:65,width:'100%'}}> 
                <Text style={[styles.texto,{textAlign:"center"}]}> Se estan actualizando todos los productos..</Text>
              </View>
          }

      
    </MiModal>
        <View style={Interface.container}>
          <Text style={styles.texto}>Aqui puedes actualizar tu inventario</Text>
          {dataSimilar ==undefined &&  <ActivityIndicator  size = {'large'} animating={true} color={'blue'} />}
          {dataSimilar && dataEmpaque && 
              <TouchableOpacity onPress={() => handleBoton()}>
                <Text style={[Interface.boton,{marginTop:50,width:"100%" }]}>Actualizar</Text>
              </TouchableOpacity>                
          }
        </View>                
    </ImageBackground>    
)
}

const styles = StyleSheet.create({
  boton:{    
    marginHorizontal:20,
    marginTop:50,               
  },
  texto:{
    marginTop:10,
    textAlign:"center",
    fontSize:20,
    fontWeight:"bold",
    color:Interface.colorText
  },
  button:{
      marginTop:20,
      width:120,
  }
})


export default DescargarInventario