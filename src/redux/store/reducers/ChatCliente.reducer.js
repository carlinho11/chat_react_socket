import { SET_CONVERSA, ADD_MENSAGEM, SET_MENSAGENS, SET_ATENDENTE, SET_MENSAGEM, SET_LOGIN, SET_NOME } from "../../types";

const INITIAL_STATE = {
    conversa: {},
    mensagens: [],
    atendente: {},
    mensagem: "",
    nome: "",
    login: 0,
};
//chatAtendenteReducer
export default function (state= INITIAL_STATE, action) {
    switch (action.type) {

        case SET_LOGIN:
            return { ...state, login: action.payload.login };

        case SET_NOME:
            return { ...state, nome: action.payload.nome };
        
        case SET_CONVERSA:
            return { ...state, conversa: { ...action.payload.conversa } };
        
        case SET_MENSAGEM:
            return { ...state, mensagem: action.payload.mensagem };

        case ADD_MENSAGEM:
            return { ...state, mensagens: [ ...state.mensagens, {...action.payload.mensagem}]};
            
        case SET_MENSAGENS:
            return { ...state, mensagens: [ ...action.payload.mensagens ] };

        case SET_ATENDENTE:
            return { ...state, atendente: { ...action.payload.atendente } };

        default:
            return state;
    }
};
