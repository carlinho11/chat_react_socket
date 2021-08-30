import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from 'react-bootstrap';
import { io } from "socket.io-client";
import Select from 'react-select';
import { axiosProxy } from '../connection';
import { setAtendente, setMensagem, setConversas, setConversa, setMensagens, setAtendentes, addMensagem, setLogin } from "../redux/store/actions/ChatAtendente.action";
import { useDispatch, useSelector } from "react-redux";


let socket;
const CONNECTION_PORT = "localhost:3001";

function ChatAtendente() {

  const dispatch = useDispatch();
  const stateChatAtendente = useSelector(state => state.chatAtendente)
  const ref = useRef(null)

  useEffect( ()  => {
    socket = io(CONNECTION_PORT, {
      transports: ['websocket', 'polling', 'flashsocket']
    });
  }, [CONNECTION_PORT]);

  useEffect(() => {
    axiosProxy().get('/Atendentes')
      .then( (res) =>{
        dispatch(setAtendentes(res.data));
      }).catch(err => console.log(err));
  },[]);

  useEffect(() => {
    socket.on("atendenteConectou", (data) => {
      dispatch(setLogin(1));
    });
    return () => socket.off('atendenteConectou')
  },[]);

  useEffect(() => {
    const novaConversa = () => {
      atualizarConversas();
      notificacao('Nova Conversa',stateChatAtendente.atendente.nomeAtendente+', há uma nova conversa pendente!')
    }
    socket.on("novaConversa",novaConversa);
    return () => socket.off('novaConversa',novaConversa)
  }, [stateChatAtendente]);

  useEffect(() => {
    const receberMensagem = (mensagem) => {
      if(stateChatAtendente.conversa){
        if(stateChatAtendente.conversa.idConversa==mensagem.idConversa){
          dispatch(addMensagem(mensagem));
          if(ref.current!=null){
            ref.current.scrollTo(0, ref.current.scrollHeight)
          }
        }
      }
    }
    socket.on("receberMensagem",receberMensagem);
    return () => socket.off('receberMensagem',receberMensagem)
  }, [stateChatAtendente]);

  const conectarAtendente= () => {
    const atendente = ({idAtendente:stateChatAtendente.atendente.idAtendente, nomeAtendente: stateChatAtendente.atendente.nomeAtendente, tokenAtendente:socket.id });
    socket.emit("conectarAtendente", atendente);
    atualizarConversas();
  };

  const selecionaAtendente = (item) => {
    const atendente = {
      nomeAtendente:item.label,
      idAtendente:item.idAtendente
    }
    dispatch(setAtendente(atendente));
  }

  const atualizarConversas = () => {
    if(stateChatAtendente.atendente.idAtendente!=null){
      axiosProxy().get('/Conversas?idAtendente='+stateChatAtendente.atendente.idAtendente)
      .then( async (res) =>{
          const conversas = await res.data;
          dispatch(setConversas(conversas));
      });
    }
  }

  function aceitarConversa(idConversa, tokenConversa){
    const data={idAtendente:stateChatAtendente.atendente.idAtendente, idConversa:idConversa, tokenConversa:tokenConversa, nomeAtendente:stateChatAtendente.atendente.nomeAtendente }
    socket.emit("aceitarConversa",data);
  }

  function atualizarMensagens(idConversa){
    axiosProxy().get('/Mensagens?idConversa='+idConversa)
        .then(async res =>{
            const mensagens = await res.data;
            dispatch(setMensagens(mensagens));
        });
  }

  const enviarMensagem = async () => {
    let mensagem = {
      idConversa: stateChatAtendente.conversa.idConversa,
      idAtendente: stateChatAtendente.atendente.idAtendente,
      nomeConversa: stateChatAtendente.conversa.nomeConversa,
      enviou: '0',
      mensagem: stateChatAtendente.mensagem,
      hora:'',
    };
    socket.emit("enviarMensagem", mensagem);
    dispatch(addMensagem(mensagem));
    dispatch(setMensagem(""));
    setTimeout(() => {
        if(ref.current!=null){
            ref.current.scrollTo(0, ref.current.scrollHeight)
          }
    }, 100);
  };

  function notificacao(titulo, mensagem) {
    if (!("Notification" in window)) {
      console.log("Esse navegador não suporta notificação!");
    } else {
      Notification.requestPermission();
      const options = {
        body: mensagem,
        //icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg",
      };
      new Notification(titulo, options);
    }
  }



  const chatHTML =
    <div className="chat">
      <div className="conversa"> 
      <div>Total de conversas: {stateChatAtendente.conversas.length}</div>
       {stateChatAtendente.conversas.map((conversa)=>
        <button 
        className={conversa.status=='0'?"botao_aguardando":"botao_aceito"}
        
          onClick={()=>{
            
            if(conversa.status=='0'){
              aceitarConversa(conversa.idConversa, conversa.tokenConversa);
              atualizarConversas();
            }
            atualizarMensagens(conversa.idConversa)
            dispatch(setConversa(conversa));
          }}
          key={conversa.idConversa}>
          {conversa.nomeConversa}
        </button >
       )}
       {(stateChatAtendente.conversa.idConversa!=null)?
        <div>Conversando com o {stateChatAtendente.conversa.nomeConversa}</div>:<div></div>}
       </div>
      {(stateChatAtendente.conversa.idConversa!=null)?
      <div className="conteudo-chat" ref={ref}>
        {
            Object.keys(stateChatAtendente.mensagens).map(i => {
              return <div key={i}>
              {stateChatAtendente.mensagens[i].enviou=='0'?
                <div className="divEnviou" >
                      <label className="nomeEnviou">Você</label><br></br>
                    {stateChatAtendente.mensagens[i].mensagem}
                </div>:
                <div className="divRecebeu" >
                    <label className="nomeRecebeu" >{stateChatAtendente.mensagens[i].nomeConversa} - {stateChatAtendente.mensagens[i].hora}s</label><br></br>
                  {stateChatAtendente.mensagens[i].mensagem}
                </div>
                }
              </div>
            })
          }
    </div>
    :<div>Selecione a conversa</div>}
    {(stateChatAtendente.conversa.idConversa!=null)?<div className="enviarMensagem">
    <div className="row col-12">
        <div className="col-10">
          <textarea 
            spellCheck="true"
            placeholder="Digite a mensagem"
            rows="3"
            value={stateChatAtendente.mensagem}
            onChange={(e) => dispatch(setMensagem(e.target.value))}
          />
        </div>
        <div className="col-2" >
          <br></br>
          <button className='botao_enviar' onClick={()=>enviarMensagem()}>Enviar</button>
        </div>
    </div>
    </div>:<div></div>}
    </div>;

  const formularioHTML = 
  <div className='formulario'>
    <div className='bordaLogin' ></div>
    <Select className='campoNome'
          options={stateChatAtendente.atendentes}
          onChange={selecionaAtendente}
        />
    <button className='botao' onClick={conectarAtendente}>Login</button>
  </div>;

  const erroHTML =
    <div>Erro</div>;

  switch (stateChatAtendente.login) {
    case 0:
      return formularioHTML;
    case 1:
      return chatHTML;
    default:
      return erroHTML
   }
}


export default ChatAtendente;
