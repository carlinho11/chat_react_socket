import { SET_CONVERSA, SET_MENSAGENS, SET_MENSAGEM, SET_ATENDENTE, ADD_MENSAGEM, SET_LOGIN, SET_NOME } from "../../types";

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

export function setNome(nome) {
	return {
		type: SET_NOME,
		payload: { nome },
	};
}

export function setAtendente(atendente) {
	return {
		type: SET_ATENDENTE,
		payload: { atendente },
	};
}

export function setMensagem(mensagem) {
	return {
		type: SET_MENSAGEM,
		payload: { mensagem },
	};
}

export function addMensagem(mensagem) {
	return {
		type: ADD_MENSAGEM,
		payload: { mensagem },
	};
}

export function setMensagens(mensagens) {
	return {
		type: SET_MENSAGENS,
		payload: { mensagens },
	};
}

