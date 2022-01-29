import React, { useState, useEffect } from 'react'
import {View, ImageBackground,Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native'
import * as Interface from '../components/interface'
import * as SQLITE from 'expo-sqlite'
import { AntDesign } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'

const db = SQLITE.openDatabase("db.db");
let id_surdito

function similaresScreen({navigation, route}){
    const {dataTable, cantidad, empaque, claveSimilar} = route.params  
    
    const [terminado, setTerminado] = useState(false) //bandera para indicar que termine el surtido y navegar a datosScreen
    const [dataInventario, setDataInventario] = useState([])
    const [completo, setCompleto] = useState(false) //verifica que el surtido coincida con el total de piezas
    const [nombreSimilar, setNombreSimilar] = useState(false)
    const [totalPiezas, setDatatotalPiezas] = useState('0')
    const [productoSeleccionado, setproductoSeleccionado] = useState('')    
    const [dataEmpaque, setDataEmpaque] = useState([])
    const [empaqueFiltrado,setempaqueFiltrado]= useState([]) 
    const [listProductos, setlistProductos] = useState([])  //guarda los datos para la tabla que muestro en remisiones
    const [cant,setCant] = useState('1') 

    const remisionesRedux = useSelector(state => state.remisiones)

    const dispatch = useDispatch()

     //Al terminar enviamos listProductos actualizado 
     useEffect(() =>{
      terminado ? navigation.navigate('Datos',{dataTable:listProductos})
      : null
    },[terminado])

    //verifica que el surtido coincida con el total de piezas
    useEffect(() =>{
      cantidad * empaque.piezas == totalPiezas ? setCompleto(true)
      : setCompleto(false)
    },[totalPiezas])

    //obtener total
    useEffect(() =>{
      let total = listProductos.map((el) => parseInt(el.cantidad) * el.piezas)            
      let  sum = total.reduce((prev, next) => prev + next,0)      
      setDatatotalPiezas(sum)
    },[listProductos])

    useEffect( () => {
        console.log(remisionesRedux)
        id_surdito = String(Math.random()) //id que le voy a asignar a este producto surdito
        db.transaction(
          tx => {               
            tx.executeSql("select inventario.clave as claves, inventario.producto as productos, listasimilar.descripcion as descripciones from inventario, similares, listasimilar where inventario.clave = similares.producto and similares.clave = listasimilar.clave and listasimilar.clave = ?", [claveSimilar],  (tx, res) =>  {            
              let resul = [];let index = 0
              while (index < res.rows.length) {
                resul = [...resul,res.rows.item(index)]
                index++              
              }            
              setDataInventario(resul)                                  
              setNombreSimilar(resul[0].descripciones)
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
        if (parseInt(cant)) {  
          setlistProductos([
            ...listProductos,{
            id: String(Math.random()),
            producto:productoSeleccionado,
            empaque:item.empaque,
            precio:'0', 
            cantidad:cant, 
            total: '0',
            surtido:id_surdito,
            clave: item.clave,  //los necesito para el boton de aumentar y disminuir de remisiones
            piezas:item.piezas}
          ])     
    
          //limpiar ventana        
          setCant('1')        
          setempaqueFiltrado([])        
          setproductoSeleccionado('')
        } else  {
          alert('Cantidad incorrecta ')
          
        }
    }

      const changeCantidad = (cant) => {      
        setCant(cant)        
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

      const handleAgregar = () => {
        //Guardar en Redux
        dispatch({type:'AGREGAR_REMISION', data:[
          ...dataTable,
          {
          id: String(Math.random()),
          producto:nombreSimilar,
          empaque:empaque.empaque,
          precio:empaque.precio, 
          cantidad:cantidad,
          total: empaque.precio * cantidad,
          surtido:id_surdito,
          clave: 'GENERICA',  //los necesito para el boton de aumentar y disminuir de remisiones
          piezas:empaque.piezas},
          ...listProductos
        ]})

        setlistProductos([
          ...dataTable,
          {
          id: String(Math.random()),
          producto:nombreSimilar,
          empaque:empaque.empaque,
          precio:empaque.precio, 
          cantidad:cantidad,
          total: empaque.precio * cantidad,
          surtido:id_surdito,
          clave: 'GENERICA',  //los necesito para el boton de aumentar y disminuir de remisiones
          piezas:empaque.piezas},
          ...listProductos
        ])  
        setTerminado(true)  
      }
      
    return( 
      
        <ImageBackground source={Interface.fondo} style={{flex:1}}>
          <ScrollView >
            <View style={Interface.container}>
                {completo ?
                  <TouchableOpacity onPress={() => handleAgregar()}>
                    <Text style={[Interface.boton, {marginTop:5,width:'100%'}]}>aceptar</Text>
                  </TouchableOpacity>
                : null
                }                
                <Text style={styles.text}>{cantidad} {empaque.empaque} {nombreSimilar} ${empaque.precio * cantidad}</Text>
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
                <TextInput 
                  placeholder="Cantidad" 
                  keyboardType='numeric'
                  value={cant} 
                  style={styles.input} 
                  onChangeText={(x) => changeCantidad(x)}
                />

            </View>

          
            <View style={Interface.container}>
              <Text style={styles.encabezadoListas}>Productos</Text>
              <FlatList                         
                    //style={{height:110}}
                    data={dataInventario} 
                    extraData={productoSeleccionado}           
                    keyExtractor={(item) =>item.claves}
                    renderItem={({item}) => <TouchableOpacity style={{marginBottom:10}} onPress={ () => handleListaProductos(item)}>                                                                
                                                {productoSeleccionado == item.productos ? 
                                                  <Text style={styles.textstrike}>{item.productos}</Text>
                                                  : <Text style={styles.text}>{item.productos}</Text>
                                                }                                                
                                            </TouchableOpacity>}
                /> 

          </View>
          

           
            <View style={Interface.container}>
              <Text style={styles.encabezadoListas}>Empaques</Text>
              <FlatList                     
                  data={empaqueFiltrado}
                  extraData={cant}
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
      textstrike:{
        color:Interface.colorText,
        fontWeight:"bold",
        backgroundColor: 'rgba(0,0,0,0.1) ',
        borderRadius:50,
        paddingLeft:5,
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

