import React, {useEffect, useState} from 'react'
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native'
import * as SQLITE from 'expo-sqlite'

const db = SQLITE.openDatabase("db.db");



const borrartodoSql = () => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from inventario;`, [])        
        tx.executeSql(`delete from empaques;`, [])        
      },
      (e) => console.log(e.message),//error
      console.log('Hecho'))// exito
  }

 


function DescargarInventario (){    
    const [dataInventario, setDataInventario] = useState() //miarroba
    const [dataEmpaque, setDataEmpaque] = useState() //miarroba

    //creacion de tablas
    useEffect(() =>{
        db.transaction(tx => {
          tx.executeSql("create table if not exists inventario (clave text, producto text, iva text, usuario text, fecha date, ieps text)");
          tx.executeSql("create table if not exists empaques (clave text, empaque text, precio text, piezas integer, barras text, id integer)");
        });    
      },[])

    //llenar db local con los datos de la nube    

    const agregarSql = () => {        
        db.transaction(
          tx => {       
            dataInventario.forEach(
                (ele) => tx.executeSql("insert into inventario (clave, producto, iva, usuario, fecha , ieps) values (?, ?, ?, ?, ?, ?)", [ele.clave, ele.producto, ele.iva, ele.usuario, ele.fecha, ele.ieps])
            )
            dataEmpaque.forEach(
              ele => tx.executeSql("insert into empaques (clave, empaque, precio, piezas, barras , id) values (?, ?, ?, ?, ?, ?)", [ele.clave, ele.empaque, ele.precio, ele.piezas, ele.barras, ele.id])
            )            
          },
          (e) => console.log(e.message))//error
      }

      //llamamos los datos del inventario de miarroba
    /* useEffect(() => {
      const fetchInventario = async () => {       
        const response = await fetch('https://cors-anywhere.herokuapp.com/' +'https://mysilver.webcindario.com/Tiendas/SMinventario.json')   
        console.log(response)
        const data = await response.json()       
        let simpleData =''               
        
        //el objeto que traigo con fetch tiene muchas ramas, lo hago mas corto con este codigo
        for (let index = 0; index < data.FDBS.Manager.TableList[0].RowList.length; index++) {
          simpleData = [data.FDBS.Manager.TableList[0].RowList[index].Original,...simpleData]
        }
        setDataInventario(simpleData)                      
      } 

      const fetchEmpaque = async () => {       
        const response = await fetch('https://cors-anywhere.herokuapp.com/' +'https://mysilver.webcindario.com/Tiendas/SMempaque.json')   
        console.log(response)
        const data = await response.json()       
        let simpleData =''               
        
        //el objeto que traigo con fetch tiene muchas ramas, lo hago mas corto con este codigo
        for (let index = 0; index < data.FDBS.Manager.TableList[0].RowList.length; index++) {
          simpleData = [data.FDBS.Manager.TableList[0].RowList[index].Original,...simpleData]
        } 

        
        setDataEmpaque(simpleData)                      
      }
      fetchInventario()
      fetchEmpaque()
    },[])  */  

    useEffect(() => {
      const fetchInventario = async () => {       
        const response = await fetch('https://vercel-api-eta.vercel.app/api/inventario' )
        
        const data = await response.json()       
        setDataInventario(data)        
      }

      const fetchEmpaque = async () => {       
        const response = await fetch('https://vercel-api-eta.vercel.app/api/empaque' )
        
        const data = await response.json()       
        setDataEmpaque(data)        
      }


      fetchInventario()
      fetchEmpaque()
    },[])   

return(
        <View >
            <Text style={styles.texto}>Aqui puedes actualizar tu inventario</Text>
            {dataEmpaque ==undefined && <ActivityIndicator />}
            {dataInventario && dataEmpaque && 
                <View style={styles.boton}>
                  <Button  title="Actualizar" onPress={() => {
                    borrartodoSql()
                    agregarSql()}}/>                  
                </View>
            }
            

        </View>
    )
}

const styles = StyleSheet.create({
  boton:{    
    marginHorizontal:20,
    marginTop:50,               
  },
  texto:{
    marginTop:10,
    alignSelf:'center',
    alignItems:'center',
    height:50
  }
})


export default DescargarInventario