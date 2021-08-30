import { combineReducers } from "redux";
import chatAtendenteReducer from "./ChatAtendente.reducer";
import chatClienteReducer from "./ChatCliente.reducer";


export default combineReducers({
    chatAtendente:chatAtendenteReducer,
    chatCliente:chatClienteReducer,
    //
});