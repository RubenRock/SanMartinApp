import React, {useEffect, useState} from 'react'
import {View} from 'react-native'
import { connect, useSelector  } from 'react-redux'

import * as SQLITE from 'expo-sqlite'
const db = SQLITE.openDatabase("db.db");


    const Descargas = ({state,cargaInventario ,cargaEmpaque, cargaSimilar, cargaUsuarios, cargaAccesos, cargaRemisiones}) =>{
    const[dataInventario, setDataInventario] = useState([])
    const[dataEmpaque, setDataEmpaque] = useState([])
    const[dataSimilares, setDataSimilares] = useState([])
    const[dataUsuarios, setDataUsuarios] = useState([])
    const[dataAccesos, setDataAccesos] = useState([])
    const[dataRemisiones, setDataRemisiones] = useState([])
    

    useEffect(() =>{
        db.transaction(
            tx => {   
              tx.executeSql("select * from usuarios", [],  (tx, res) =>  {            
                let resul = [];let index = 0
                while (index < res.rows.length) {
                  resul = [...resul,res.rows.item(index)]
                  index++              
                }            
                setDataUsuarios(resul)                                  
              }),

              tx.executeSql("select * from accesos", [],  (tx, res) =>  {            
                let resul = [];let index = 0
                while (index < res.rows.length) {
                  resul = [...resul,res.rows.item(index)]
                  index++              
                }            
                setDataAccesos(resul)                                  
              }),

              tx.executeSql("select * from similares", [],  (tx, res) =>  {            
                let resul = [];let index = 0
                while (index < res.rows.length) {
                  resul = [...resul,res.rows.item(index)]
                  index++              
                }            
                setDataSimilares(resul)                                  
              }),

              tx.executeSql("select * from inventario", [],  (tx, res) =>  {            
                let resul = [];let index = 0;
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

            console.log('termino acciones Redux')
        },[])

    useEffect(() => {      
        cargaUsuarios(dataUsuarios)
        cargaAccesos(dataAccesos)
        cargaEmpaque(dataEmpaque)
        cargaInventario(dataInventario)
        cargaSimilar(dataSimilares)        
    },[dataEmpaque])   
   
   

    return(
        <View>
            {/* {console.log('acciones')}         */}
        </View>
    )

}

const mapStateToProps = state => ({
    inventario: state.inventario,
    state: state
  })
  
const mapDispatchToProps = dispatch => ({
    cargaInventario(data){
        dispatch({
            type:"CARGAR_INVENTARIO",
            data
        })
    },

    cargaEmpaque(data){
        dispatch({
            type:"CARGAR_EMPAQUE",
            data
        })
    },

    cargaSimilar(data){
        dispatch({
            type:"CARGAR_SIMILAR",
            data
        })
    },
    
    cargaUsuarios(data){
      dispatch({
          type:"CARGAR_USUARIOS",
          data
      })
    },

    cargaAccesos(data){
      dispatch({
          type:"CARGAR_ACCESOS",
          data
      })
    },

    cargaRemisiones(data){
      dispatch({
          type:"CARGAR_REMISIONES",
          data
      })
    },

  })

  export default connect(mapStateToProps,mapDispatchToProps)(Descargas)