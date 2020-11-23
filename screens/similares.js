import React, { useState, useEffect } from 'react'
import {View, ImageBackground,Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native'
import * as Interface from '../components/interface'
import * as SQLITE from 'expo-sqlite'
import { AntDesign } from '@expo/vector-icons'

const db = SQLITE.openDatabase("db.db");

function similaresScreen({navigation, route}){
    const {cantidad, producto, empaque} = route.params  

    const [dataInventario, setDataInventario] = useState([])
    const [completo, setCompleto] = useState(false)
    const [totalPiezas, setDatatotalPiezas] = useState('0')
    const [productoSeleccionado, setproductoSeleccionado] = useState('')    
    const [dataEmpaque, setDataEmpaque] = useState([])
    const [empaqueFiltrado,setempaqueFiltrado]= useState([]) 
    const [listProductos, setlistProductos] = useState([])  //guarda los datos para la tabla que muestro en remisiones
    const [cant,setCant] = useState('1') 

    useEffect(() =>{
      cantidad * empaque.piezas == totalPiezas ? setCompleto(true)
      : setCompleto(false)
    },[totalPiezas])

    useEffect(() =>{
      let total = listProductos.map((el) => parseInt(el.cantidad) * el.piezas)            
      let  sum = total.reduce((prev, next) => prev + next,0)      
      setDatatotalPiezas(sum)
    },[listProductos])

    useEffect( () => {
        db.transaction(
          tx => {               
            tx.executeSql("select inventario.clave as claves, inventario.producto as productos from inventario, similares where inventario.clave = similares.producto", [],  (tx, res) =>  {            
              let resul = [];let index = 0
              while (index < res.rows.length) {
                resul = [...resul,res.rows.item(index)]
                index++              
              }            
              setDataInventario(resul)                                  
            }),

            tx.executeSql("select * from empaques", [],  (tx, res) =>  {            
              let resul = [];let index = 0
              while (index < res.rows.length) {
                resul = [...resul,res.rows.item(index)]
                index++              
              }            
              setDataEmpaque(resul)                                  
            })

          },
          (e) => console.log(e.message))
      },[])    

      const handleListaProductos = (item)=>{          
        setproductoSeleccionado(item.productos) //almaceno el producto seleccionado
        setempaqueFiltrado(dataEmpaque.filter(data => data.clave ==item.claves )) //filtra la lista de empaques             
      }

      const handleListaEmpaque = (item) =>{      
      
        setlistProductos([
          ...listProductos,{
          id: String(Math.random()),
          producto:productoSeleccionado,
          empaque:item.empaque,
          precio:'0', 
          cantidad:cant,
          total: '0',
          clave: item.clave,  //los necesito para el boton de aumentar y disminuir de remisiones
          piezas:item.piezas}
        ])     
  
        //limpiar ventana        
        setCant('1')        
        setempaqueFiltrado([])        
      }

      const changeCantidad = (cant) => {      
        setCant(cant)
        setempaqueFiltrado([]) //necesito actualizar el estado de la variable cada vez que la modifico     
      }

      const aumentar = (item) =>{
        let data = [...listProductos] 
        let index = (data.findIndex((x) => x.id == item.id))      
        data[index].cantidad = parseInt(data[index].cantidad)+1              
        setlistProductos(data)
      }

      const disminur = (item) =>{
        let data = [...listProductos] 
        let index = (data.findIndex((x) => x.id == item.id)) 
        if (parseInt(data[index].cantidad) > 1) {  
          data[index].cantidad = parseInt(data[index].cantidad)-1              
          setlistProductos(data)
        }        
      }

    return( 
      
        <ImageBackground source={Interface.fondo} style={{flex:1}}>
          <ScrollView >
            <View style={Interface.container}>
                {completo ?
                  <TouchableOpacity>
                    <Text style={[Interface.boton, {marginTop:5}]}>aceptar</Text>
                  </TouchableOpacity>
                : null
                }
                <Text style={styles.text}>{cantidad} {empaque.empaque} {producto}  </Text>
                <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                    <View>
                      <Text style={[styles.text,{fontSize:20, textAlign:"center"}]}>{cantidad * empaque.piezas}</Text>
                      <Text style={[styles.text,{fontSize:10}]}>Piezas</Text>
                    </View>
                    <View>
                      <Text style={[styles.text,{fontSize:20, textAlign:"center"}]}>{totalPiezas}</Text>
                      <Text style={[styles.text,{fontSize:10}]}>Piezas agregadas</Text>
                    </View>
                </View>
                <TextInput placeholder="Cantidad" value={cant} style={styles.input} onChangeText={(x) => changeCantidad(x)}/>

            </View>

            <View style={{height:120}}>
                <View style={Interface.container}>
                  <Text style={styles.encabezadoListas}>Productos</Text>
                  <FlatList                         
                        data={dataInventario}            
                        keyExtractor={(item) =>item.claves}
                        renderItem={({item}) => <TouchableOpacity onPress={ () => handleListaProductos(item)}>                
                                                    <Text style={styles.text}>{item.productos}</Text>
                                                </TouchableOpacity>}
                    /> 

              </View>
            </View >

           
            <View style={[Interface.container,{height:150}]}>
              <Text style={styles.encabezadoListas}>Empaques</Text>
              <FlatList                     
                  data={empaqueFiltrado}
                  keyExtractor={(item) =>String(item.id)}
                  renderItem={({item}) =>  {
                      if (item.empaque !=='SEIS' && item.empaque !=='DOCE')
                        return(
                          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>                      
                            <Text style={styles.text} >{item.empaque} - {item.precio}</Text> 
                            <View style={{flexDirection:'row'}}>                                
                              <AntDesign name="pluscircleo" size={24} color={Interface.colorText} onPress={ () => handleListaEmpaque(item)} />                      
                            </View>
                          </View>  
                        )                                   
                        
                    }
                    }
                />
              </View>
            

            <View style={{flex:1}}>
              <View style={Interface.container}>
                  <Text style={styles.encabezadoListas}>Listado del surtido</Text>
                  <FlatList                         
                        data={listProductos}            
                        keyExtractor={(item) =>item.id}
                        renderItem={({item}) => <View style={{flex:1,flexDirection:'row',justifyContent:'space-between', marginTop:10}}>
                                                    <View style={{flex:3}}>
                                                      <Text style={styles.text}>{item.cantidad} - {item.empaque} {item.producto}</Text>
                                                    </View>
                                                    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                                                      <AntDesign name="pluscircleo" size={24} color="#3F3DE0" onPress={() => aumentar(item)}/>
                                                      <AntDesign name="minuscircleo" size={24} color="#3F3DE0" onPress={() => disminur(item,parseInt(item.cantidad))}/>
                                                      <AntDesign name="delete" size={24} color="#3F3DE0" onPress={() => setlistProductos(listProductos.filter((data)=> data.id !==item.id))}/>
                                                    </View>
                                                </View>}                                            
                    /> 
               </View >
            </View >
          </ScrollView> 
        </ImageBackground>
            
    )
}

const styles = StyleSheet.create({
    input:{
        borderBottomWidth:2,
        borderColor:'white',
        marginTop:10,
        color:Interface.colorText
      },
      text:{
        color:Interface.colorText,
        fontWeight:"bold"
      },
      encabezadoListas:{
        backgroundColor:Interface.colorText, 
        color:"white", 
        textAlign:"center",
        borderTopEndRadius:20,
        borderTopStartRadius:20
      }
})

export default similaresScreen

