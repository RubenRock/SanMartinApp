import {createStore} from 'redux'

const initialState = {
    inventario:[],
    empaque:[],
    similar:[],
    listasimilar:[],
    usuarios:[],
    accesos:[],
    user:[],
    remisiones:[]
}



const reducer = (state = initialState, action) =>{          
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

    if(action.type === "CARGAR_SIMILAR"){    
      return{
        ...state,
        similar: action.data,        
      }      
    }

    if(action.type === "CARGAR_USUARIOS"){    
      return{
        ...state,
        usuarios: action.data,        
      }      
    }

    if(action.type === "CARGAR_USER"){    
      return{
        ...state,
        user: action.data,        
      }      
    }

    if(action.type === "CARGAR_ACCESOS"){    
      return{
        ...state,
        accesos: action.data,        
      }      
    }
    
    if(action.type === "AGREGAR_USUARIOS"){    
      return{
        ...state,        
        usuarios: [action.data].concat(state.usuarios)
      }      
    }
    
    if(action.type === "AGREGAR_REMISION"){    
      return{
        ...state,        
        remisiones: action.data
      }      
    }
          
    return state
}

export default createStore(reducer)