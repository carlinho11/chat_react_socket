import { SET_CONVERSA, SET_MENSAGENS, SET_MENSAGEM, SET_CONVERSAS, SET_ATENDENTE, SET_ATENDENTES, ADD_MENSAGEM, SET_LOGIN } from "../../types";

export function setConversa(conversa) {
	return {
		type: SET_CONVERSA,
		payload: { conversa },
	};
}

export function setLogin(login) {
	return {
		type: SET_LOGIN,
		payload: { login },
	};
}

export function setAtendente(atendente) {
	return {
		type: SET_ATENDENTE,
		payload: { atendente },
	};
}


export function addMensagem(mensagem) {
	return {
		type: ADD_MENSAGEM,
		payload: { mensagem },
	};
}

export function setMensagem(mensagem) {
	return {
		type: SET_MENSAGEM,
		payload: { mensagem },
	};
}

export function setMensagens(mensagens) {
	return {
		type: SET_MENSAGENS,
		payload: { mensagens },
	};
}

export function setAtendentes(atendentes) {
	return {
		type: SET_ATENDENTES,
		payload: { atendentes },
	};
}

export function setConversas(conversas) {
	return {
		type: SET_CONVERSAS,
		payload: { conversas },
	};
}
