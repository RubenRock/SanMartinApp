import { StatusBar } from 'expo-status-bar';
import React ,{useState} from 'react';
import { StyleSheet, Image, Text, View} from 'react-native';
import pruebaScreen from './screens/prueba'
import HomeScreen from './screens/home'
import remisionesScreen from './screens/remisiones'
import datosScreen from './screens/datos'
import extrasScreen from './screens/extras'
import listaRemisionScreen from './screens/listaremision'
import DescargarInventario from './screens/descargarinventario'
import similaresScreen from './screens/similares'
import LoginScreen from './screens/login'
import accesosScreen from './screens/accesos'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {Provider} from 'react-redux'
import store from './components/Redux/store'
import AccionesRedux from './components/Redux/accionesRedux'

import * as SQLITE from 'expo-sqlite'
const db = SQLITE.openDatabase("db.db");


const image = require('./assets/Logo4.png')
const Stack = createStackNavigator();
const Prueba = createStackNavigator();


function MyStack() {  
  return (
    <Stack.Navigator>     
      <Stack.Screen name="Home" component={HomeScreen}  options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/>      
      <Stack.Screen name="Remisiones" component={remisionesScreen} options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/>      
      <Stack.Screen name="Datos" component={datosScreen} options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/>     
      <Stack.Screen name="Prueba" component={datosScreen} options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/>      
      <Stack.Screen name="InventarioNube" component={DescargarInventario}options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/>  
      <Stack.Screen name="ListaRemision" component={listaRemisionScreen} options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/> 
      <Stack.Screen name="Extras" component={extrasScreen} options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/> 
        <Stack.Screen name="Similares" component={similaresScreen} options={{         
          headerStyle: {
            backgroundColor: '#3F3DE0',           
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Image source={image} style={styles.image} /> 
          ),}}/>

          <Stack.Screen name="Accesos" component={accesosScreen} options={{         
              headerStyle: {
                backgroundColor: '#3F3DE0',           
              },
              headerTintColor: 'white',
              headerRight: () => (
                <Image source={image} style={styles.image} /> 
              ),}}/>
        </Stack.Navigator>
  );
}

function StackPrueba() {
  return (
    <Prueba.Navigator>
      <Prueba.Screen name="prueba" component={pruebaScreen} />            
    </Prueba.Navigator>
  );
}



export default function App() {
  const [isLogged, setIslogged] = useState(false)

  return (
    <Provider store={store}>
        <AccionesRedux />
        <NavigationContainer>          
         {isLogged ? 
            <MyStack />     
            :
            <LoginScreen accion={setIslogged} />
          }         
          <StatusBar style="auto" />
        </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginRight:15,
    borderRadius:50,
    width: 40,
    height: 40,   
    
   /*  shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    
    elevation: 15, */
  },
});
