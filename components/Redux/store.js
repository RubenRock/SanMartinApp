import {createStore} from 'redux'

const initialState = {
    inventario:[],
    empaque:[],
    similar:[],
    listasimilar:[]
}



const reducer = (state = initialState, action) =>{        
  console.log(action)
    if(action.type === "CARGAR_INVENTARIO"){   
      return{
          ...state,
          inventario: action.data,        
      }
    }

    if(action.type === "CARGAR_EMPAQUE"){    
      return{
        ...state,
        empaque: action.data,        
      }      
    }
          
    return state
}

export default createStore(reducer)