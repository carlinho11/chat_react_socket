import { SET_CONVERSA, SET_CONVERSAS, SET_MENSAGEM, SET_MENSAGENS, SET_ATENDENTE, SET_ATENDENTES, ADD_MENSAGEM, SET_LOGIN } from "../../types";

const INITIAL_STATE = {
    conversa: {},
    conversas: [],
    mensagem: "",
    mensagens: [],
    atendente: {},
    atendentes: [],
    login: 0,
};
//chatAtendenteReducer
export default function (state= INITIAL_STATE, action) {
    switch (action.type) {
        
        case SET_LOGIN:
            return { ...state, login: action.payload.login };
        
        case SET_CONVERSA:
            return { ...state, conversa: { ...action.payload.conversa } };
        
        case SET_MENSAGEM:
            return { ...state, mensagem: action.payload.mensagem };

        case ADD_MENSAGEM:
            return { ...state, mensagens: [ ...state.mensagens, {...action.payload.mensagem}]};
            
        case SET_MENSAGENS:
            return { ...state, mensagens: [ ...action.payload.mensagens ] };

        case SET_CONVERSAS:
            return { ...state, conversas: [ ...action.payload.conversas ] };

        case SET_ATENDENTE:
            return { ...state, atendente: { ...action.payload.atendente } };

        case SET_ATENDENTES:
            return { ...state, atendentes: [ ...action.payload.atendentes ] };

        default:
            return state;
    }
};
