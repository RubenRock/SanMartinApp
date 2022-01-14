import React, {useEffect, useState} from 'react'
import {View, Text,FlatList, StyleSheet,TouchableOpacity, TextInput, Alert, ImageBackground, Button} from 'react-native'
import * as SQLITE from 'expo-sqlite'
import * as Interface from '../components/interface'
import MiModal from '../components/mimodal'
import NetInfo from '@react-native-community/netinfo';


const db = SQLITE.openDatabase("db.db")

function listaRemisionScreen(){ 
  const [modalVisible, setModalVisible]= useState(false)    
  const [progress, setProgress] = useState(0)
  const [envioCompleto, setEnvioCompleto] = useState(false)
  const [remisiones, setRemisiones]= useState([])  
  const [listaRemision, setListaRemision] = useState([])
  const [data, setData]= useState([]) // listado de remisones de esta Screen
  const [folios, setFolios] = useState({inicio:'',fin:''})


 

  const mandarNube = async () => {  
    let fallo = false, info=''
    console.log('----lista remision------')
     //index para whille, i para arreglo que se va a guardar
     let index =parseInt(folios.inicio),i=0
     console.log(listaRemision)
    while (index <= parseInt(folios.fin)) {      
      if (listaRemision[i]){        
          console.log(listaRemision[i].folio)
          const responde = await fetch('https://vercel-api-eta.vercel.app/api/listaremision',{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify(
              {"folio":listaRemision[i].folio,
              "cliente": listaRemision[i].cliente,
              "total": listaRemision[i].total,
              "fecha": listaRemision[i].fecha,
              "vendedor":listaRemision[i].vendedor,
              "condicion":listaRemision[i].condicion,
              "estado":listaRemision[i].estado,
              "domicilio":listaRemision[i].domicilio,
              "impresion":listaRemision[i].impresion,
              "descuento":listaRemision[i].descuento}
            )
          })              
           
          if (responde.status !== 204) {  // cuando hay error
            const error = await responde.json()    
            console.log('Hay error: '+ error.details) 
            info= error.details          
            fallo= true
          } 
        }
          index++
          i++

        
      }
      console.log('----remisiones------')
      
    
    index =0
    while (index <= remisiones.length-1) {
        if(remisiones[index].folio){
            const responde = await fetch('https://vercel-api-eta.vercel.app/api/remisiones',{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify(
              {"folio":remisiones[index].folio,
              "id":remisiones[index].rowid,
              "cantidad": remisiones[index].cantidad,
              "producto": remisiones[index].producto,
              "total": remisiones[index].total,
              "tipo":remisiones[index].tipo,
              "empaque":remisiones[index].empaque,
              "descuento":remisiones[index].descuento}
            )
          })
          if (responde.status !== 204){  // cuando hay error
            const error = await responde.json()    
            console.log( error)    
            info= error.details
            fallo= true
          } 
        }   
          

          index++     
          
        }
      
    setProgress(1)
    setEnvioCompleto(true)

    fallo ?   Alert.alert(
      "Error",
      info, //me dice cual es el error
      [              
        { text: "Cerrar" }
      ],
      { cancelable: false }
    )    
    :null
    
  }
  
  useEffect(() =>{      
    listaRemision.length ? mandarNube()
    : setProgress(1)
  },[listaRemision])

  function obtenerLista (){ 
    let alisteRemision = []   
    db.transaction(
      tx => {
        tx.executeSql("select * from lista_remision where folio >= ? and folio <= ?", [folios.inicio, folios.fin],  (tx, res) =>  {            
          let index = 0
          while (index < res.rows.length) {            
            alisteRemision.push(res.rows.item(index))
            index++              
          }    
          
          setListaRemision(alisteRemision)
          setProgress(0.75)

      },
      (e) => console.log(e.message))
    })
  }

  const obtenerRemisiones = () =>{
    let aremision = []
    db.transaction(
      tx => {                                                                       
         tx.executeSql("select * from remisiones where folio >= ? and folio <= ?", [folios.inicio, folios.fin],  (tx, res) =>  {            
            let index = 0, extra ='',extra2=''
            
            while (index < res.rows.length) {
              extra= res.rows.item(index) 
              //agrego campo rowid para el id del documento de firebase
              extra2 = Object.assign({'rowid':index},extra)              
              aremision = [...aremision,extra2]              
              index++              
            }    
            
            setRemisiones(aremision)
            setProgress(0.5)
        },
        (e) => console.log(e.message))         
      })
  }

  const deleteRemisiones = async () => {       
     let responde = await fetch('https://vercel-api-eta.vercel.app/api/listaremision/',{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json',
        }
      })      
      
      if (responde.status == 200)  
        console.log('exito borrar lista remisiones') 
      else {  // cuando hay error
        const error = await responde.json()    
        console.log('Hay error: '+ error.details)    
      }   

     responde = await fetch('https://vercel-api-eta.vercel.app/api/remisiones',{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json',
        }
      })            
      if (responde.status == 200){  
        console.log('exito borrar remisiones') 
        setProgress(0.25)
      }
      else {  // cuando hay error
        const error = await responde.json()    
        console.log('Hay error: '+ error.details)    
      } 
  }

  const handleBoton = () => {
    NetInfo.fetch().then(async state => {
      console.log(state)
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);

      if (state.isConnected){
        setProgress(0)
        setEnvioCompleto(false)
        setModalVisible(true)
        await deleteRemisiones() 
        obtenerRemisiones()
        obtenerLista()  
      }else alert('no hay conexion a internet')
    })    
  }
  
  useEffect (() => {
    db.transaction(
      tx => {               
        tx.executeSql("select * from lista_remision", [],  (tx, res) =>  {            
            let resul = [];let index = 0
            while (index < res.rows.length) {
              resul = [...resul,res.rows.item(index)]
              index++              
            }    
            setData(resul)
        },
        (e) => console.log(e.message))
      })
    },[])

    const leerRemision = (folio) =>{
      let aremision = []
      db.transaction(
        tx => {                                                                       
           tx.executeSql("select * from remisiones where folio = ?", [folio],  (tx, res) =>  {            
              let index = 0, extra ='',extra2=''
              while (index < res.rows.length) {
                extra= res.rows.item(index) 
                //agrego campo rowid para el id del documento de firebase
                extra2 = Object.assign({'rowid':index},extra)              
                aremision = [...aremision,extra2]              
                index++              
              }    
             
              let resul = []
              for (let index = 0; index < aremision.length; index++) {
                resul += parseInt(aremision[index].cantidad)+' '+aremision[index].empaque+' '+aremision[index].producto+'  $'+aremision[index].total+'\n'
              }
              //alert(JSON.stringify(aremision))
              
              console.log(resul)
              alert(resul)
             
          },
          (e) => console.log(e.message))         
        })

    }
    
    return(
        <View style={styles.container}>

          <MiModal visible={modalVisible} progress={progress} title='Subiendo datos de la nube'>
                                          
                {envioCompleto ?                                      
                    <View style={styles.button}> 
                      <Button title='Completo'  onPress={() => setModalVisible(false)}></Button>                  
                    </View>
                  : 
                    <View style={{marginTop:65,width:'100%'}}> 
                      <Text style={[styles.texto,{textAlign:"center"}]}> Se estan enviando los datos..</Text>
                    </View>
                }

           
          </MiModal> 

          <ImageBackground source={Interface.fondo} style={styles.fondo}>
           
            <View style={[styles.header,Interface.container]}>
              {parseInt(folios.inicio) <= parseInt(folios.fin) && folios.fin.trim() !== '' && folios.inicio.trim() !== '' ?                
                  <TouchableOpacity onPress={() =>handleBoton()}>
                    <Text style={[Interface.boton,{width:150,marginTop:15}]}>Mandar a nube</Text>
                  </TouchableOpacity>                                                
                :null
              }
              

              
              <View>
                <TextInput style={styles.input} 
                  placeholder="Folio inicial" 
                  onChangeText={(val) => setFolios({...folios, inicio:val})}
                  keyboardType='numeric'                  
                />
                <TextInput style={styles.input} 
                  placeholder="Folio final"
                  onChangeText={(val) => setFolios({...folios, fin:val})}
                  keyboardType='numeric'
                />
              </View>
            </View>          

            <FlatList             
            data={data}
            style={Interface.container}
            keyExtractor={(ele) => String(ele.folio)}
            renderItem={({item}) =>
                <View style={styles.lista}>
                  <TouchableOpacity onPress={() => leerRemision(item.folio) }>
                    <Text style={[styles.texto,{fontWeight:'bold'}]} >Folio: {(item.folio)} -{item.cliente} </Text>
                    <Text style={[styles.texto, styles.texto_pequeño]} >Domicilio: {item.domicilio}</Text>
                    <Text style={[styles.texto, styles.texto_pequeño]} >Total: ${item.total}   Fecha: {item.fecha}</Text>
                    {/*  <Text style={[styles.texto, styles.texto_pequeño]} >Domicilio: {item.domicilio}</Text>*/}
                  </TouchableOpacity>
                </View>
              }
            />            
           
          </ImageBackground>
          
        </View>
    )

}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  fondo:{
    flex:1,
  },
  texto:{
    color:Interface.colorText,
  },
  texto_pequeño:{
    fontSize:12,
    marginBottom:3
  },
  header:{
    flexDirection:"row",
    justifyContent:'flex-end',  
    
  },
  input:{
    color: Interface.colorText,
    fontSize:15,
    borderBottomWidth:1,
    borderColor:'white',
    marginTop:5,
    marginHorizontal:10,
    width:100
   
  },
  boton:{
    margin:10
  },
  lista:{
    marginVertical:5,
    borderBottomWidth:1,
    borderColor:'white'
  },
  button:{
      marginTop:20,
      width:120,
  }
  
})

export default listaRemisionScreen