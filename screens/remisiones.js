import React,{useState, useEffect} from 'react'
import {View, Text, TextInput, StyleSheet,Picker, FlatList, Alert, ImageBackground, TouchableOpacity} from 'react-native'
import * as SQLITE from 'expo-sqlite'
import { AntDesign } from '@expo/vector-icons';
import {useSelector, useDispatch} from 'react-redux'

const db = SQLITE.openDatabase("db.db")

const fondo = require('../assets/fondo.png')


function Remisiones({navigation, route}){
    const {dataTable, encabezado} = route.params    
    
    const [currentDate, setCurrentDate] = useState('Cargando..');    
    const [table, setTable] = useState([]);  //borrar despues de implemetar remisionesRedux   
    const [mayoreo, setMayoreo] = useState({total:'',cantidad:0});    
    const [total, setTotal] = useState(0)
    const [header, setHeader]= useState({name:'',direccion:'',condicion:'CONTADO'})
    const [folio, setFolio] = useState("1")
    const [precioPieza, setPrecioPieza] = useState()

    const user = useSelector(state => state.user)
    const remisionesRedux = useSelector(state => state.remisiones)
    console.log(remisionesRedux)

    const dispatch = useDispatch()

  
    //obtenemos numero de folio de la remision

    const obtenerFolio = () => {
      db.transaction(
        tx => {                 
          tx.executeSql("select * from lista_remision", [],( _ ,{ rows }) =>
            rows.length > 0 ? setFolio(rows.length+1)
            : setFolio('1')
          )
        }
      )
    }

    useEffect(() =>{
     obtenerFolio()     
    }, [])

    useEffect(() => {                 
      setTable(dataTable)      
      setHeader(encabezado)
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds
      setCurrentDate(
        `0${date}`.slice(-2) + '/' + `0${month}`.slice(-2) + '/' + `0${year}`.slice(-2) 
        + ' ' + `0${hours}`.slice(-2) + ':' + `0${min}`.slice(-2) + ':' + `0${sec}`.slice(-2)
      );           
    },[route]) 

    

    //al realizar cualquier modificacion en la remision realizamos la suma 
    useEffect( () => {
      let data = [...remisionesRedux] 
      let total = data.map((el) => parseFloat(el.total))      
      let  sum = total.reduce((prev, next) => prev + next,0)      
      setTotal(sum)
    },[remisionesRedux])

    
    //
    const handlePrice =  (item,cantidad) => {      
      let resul, datos =[], precio = 0 
      db.transaction(
         tx => { 
           tx.executeSql("select * from empaques where clave = ?", [item.clave],  (tx, res) =>  {            
             let index = 0
            
              while (index < res.rows.length) {
                datos = [...datos,res.rows.item(index)]                
                index++              
              }

              let arrayseis= datos, arraydoce = datos, arrayunidad =datos             
              let seis = arrayseis.filter((ele) => ele.empaque == 'SEIS' && item.piezas == ele.piezas)                   
              let doce = arraydoce.filter((ele) => ele.empaque == 'DOCE' && item.piezas == ele.piezas)                    
              //recuperamos precio original de pz cuando pasamos por mayoreo
              let unidad = arrayunidad.filter((ele) => ele.empaque == item.empaque)                    

              precio= unidad[0].precio
              resul= precio*cantidad

              if (cantidad == '6')  {if (seis.length)  {resul = parseFloat(seis[0].precio).toFixed(2)
                                                        precio = (resul/cantidad).toFixed(2)}}
              if (cantidad % 12 == 0)  {if (doce.length) {resul = parseFloat((cantidad/12)*doce[0].precio).toFixed(2)
                                                          precio = (resul/cantidad).toFixed(2)}}
              
              setMayoreo({total:resul, cantidad:cantidad,id:item.id, precio:precio})              
            })
        }
      )              
    }
    
    //al presionar aumetar o disminuir cantidad, disparo este codigo
    useEffect(() => {      
      if (mayoreo.cantidad){
        let data = [...remisionesRedux] 
        let id = (data.findIndex((x) => x.id == mayoreo.id))      
        data[id].cantidad = mayoreo.cantidad     
        data[id].precio = mayoreo.precio
        data[id].total = mayoreo.total        
        setTable(data) 

        dispatch({type:'AGREGAR_REMISION', data:data})
      }
    },[mayoreo])

    const aumentar = (item,cant) =>{              
      handlePrice(item,cant+1)           
    }

    const disminur = (item,cant) =>{          
      handlePrice(item,cant-1)  
    }

    const handleGuardar = () => {
      console.log(user[0].login)
      if (remisionesRedux.length >0){
        if (header.name.trim()){     

          db.transaction(
            tx => {       
              tx.executeSql("insert into lista_remision values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [parseInt(folio), header.name.toUpperCase(), total, currentDate, user[0].login, header.condicion, "PENDIENTE", header.direccion.toUpperCase(), "SERIE", "0" ]),
            
            remisionesRedux.forEach( (ele) =>{
                tx.executeSql("insert into remisiones values (?, ?, ?, ?, ?, ?, ?)", [parseInt(folio), ele.cantidad, ele.producto, ele.total, "SERIE", ele.empaque,  "0"])
              })
            },
            (e) => console.log(e.message))    
        
          alert('Guardado correcto')
          handleClear()

        }else {
          alert('Escribe nombre del cliente')
        }
      }      
    }

    
    const handleClear = () =>{
      setHeader({name:'',direccion:'',condicion:'CONTADO'})
      setTable([])
      setTotal('0')
      obtenerFolio()
    }

    const obtenerPrecioPieza = (item) =>{      
        setPrecioPieza((item.precio/item.piezas).toFixed(2))
    }    
    
    return (
      <View style={styles.fondo}>          
        <ImageBackground source={fondo} style={styles.fondo}>
        <View style={styles.container1}>        
          <View style={{flexDirection:'row', justifyContent:'space-around'}}>
            <AntDesign name="pluscircleo" size={24} color="#3F3DE0" onPress={() => navigation.navigate('Datos', {dataTable: table, encabezado: header})} />
            <AntDesign name="save" size={30} color="#3F3DE0" onPress={() => handleGuardar()}/>            
            <AntDesign name="closecircleo" size={30} color="#3F3DE0" onPress={() => handleClear()}/>                               
          </View>
          
          <Text style={styles.text}>Folio: {folio} </Text>
          
          <TextInput 
            placeholder="Nombre del cliente" 
            style={[styles.input,styles.text]}
            onChangeText={(val) => setHeader({...header,name:val}) }            
            value={header.name}
          />  
          <TextInput 
            placeholder="Domicilio" 
            style={[styles.input,styles.text]}
            onChangeText={(val) => setHeader({...header,direccion:val})}  
            value={header.direccion}
          />  
          <Picker           
            selectedValue={header.condicion}
            style={{borderRadius:10,  backgroundColor:'rgba(255,255,255,0.1)',color:"#3F3DE0",}}
            onValueChange={(itemValue) => {                
                setHeader({...header,condicion:itemValue})
              }}
              
          >
            <Picker.Item label="CONTADO" value="CONTADO" />
            <Picker.Item label="PAGA AL RECIBIR" value="PAGA AL RECIBIR" />
            <Picker.Item label="CREDITO" value="CREDITO" />
          </Picker>        
          <Text style={styles.text}>Fecha: {currentDate}</Text>                    
        </View>

        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            {precioPieza ? 
                <Text style={[styles.text,{margin:10, fontWeight:'bold', fontSize:15}]}>Pieza: {precioPieza} </Text>
              : <Text style={[styles.text,{margin:10}]}>.</Text>
            }
            <Text style={[styles.text,{textAlign:'right', margin:10, fontWeight:'bold', fontSize:15}]}>Total: {total}</Text>
            
        </View>      

          <FlatList 
            style={styles.container2}
            data={remisionesRedux}
            //data={table}
            //keyExtractor={}
            renderItem={({item}) => 
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                  <TouchableOpacity style={{flex:3, marginBottom:12}} onPress={() => obtenerPrecioPieza(item)}>
                    <Text style={[styles.text,{fontWeight:"bold"}]}>{item.cantidad} - {item.empaque} {item.producto}</Text>
                    {item.precio !== '0' ?  /* los productos surtido le quitamos esta informacion */
                      <Text style={[styles.text,{fontWeight:"bold"}]}>     P.U.:  ${item.precio}      TOTAL: ${item.total} </Text>                                 
                      : null
                    }
                  </TouchableOpacity>

                  <View style={{flex:1,flexDirection:'row',justifyContent:'space-between', marginTop:10}}>
                    { !item.surtido ? 
                      <>
                        <AntDesign name="pluscircleo" size={24} color="#3F3DE0" onPress={() => aumentar(item,parseInt(item.cantidad))}/>
                        <AntDesign name="minuscircleo" size={24} color="#3F3DE0" onPress={() => disminur(item,parseInt(item.cantidad))}/>
                      </>
                      : null                    
                    }
                    {item.precio !== '0' ?                      
                        <AntDesign name="delete" size={24} color="#3F3DE0" onPress={() => item.surtido ? setTable(table.filter((data)=> data.surtido !== item.surtido ))
                                                                                                        : setTable(table.filter((data)=> data.id !==item.id ))}/>                      
                      : null
                    } 
                  </View>                  
                </View>
                }
          />
        </ImageBackground>
      </View>
    );
}

  export default Remisiones

  const styles = StyleSheet.create({
    fondo:{
      flex:1,
    },
    container1:{   
      marginTop:10,
      marginHorizontal:10,     
      backgroundColor:'rgba(4,119,224,0.2)',
      borderRadius:10,
      padding:8,
      alignSelf:'stretch',     
    },
    container2:{
      marginHorizontal:10,
      marginBottom:15,           
      backgroundColor:'rgba(4,119,224,0.2)',
      borderRadius:10,
      padding:8,
      alignSelf:'stretch',

      shadowColor: "#000",  
      
     
    },
    input:{     
      borderBottomWidth:2,
      borderColor:'white',
      marginBottom:10
    },
    lists:{
      backgroundColor:'#dfe6e9',
      borderRadius:10,
      padding:5,
      marginHorizontal:5,
      marginTop:20,      
      borderWidth:2,
      borderColor:'black',
      
    },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: {       
      color:"#3F3DE0" 
    },
    boton:{        
      marginTop:20,
      borderRadius:10,
      backgroundColor:'#3F3DE0',
      borderColor:'white',
      borderWidth:2,
      width:270,
      textAlign:"center",
      color:'white',
      fontWeight: 'bold',
      fontSize:15,   
      height:30,
    }
})