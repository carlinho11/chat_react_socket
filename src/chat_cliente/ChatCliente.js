import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { setAtendente, setConversa, setMensagem, addMensagem, setLogin, setNome } from "../redux/store/actions/ChatCliente.action";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form  } from 'react-bootstrap';

let socket;
const CONNECTION_PORT = "localhost:3001";

function ChatCliente(props) {

  const ref = useRef(null) 

  const dispatch = useDispatch();  

  const stateChatCliente = useSelector(state => state.chatCliente)

  useEffect( async ()  => {
    socket = io(CONNECTION_PORT, { 
      transports: ['websocket', 'polling', 'flashsocket'] 
    }); 
  }, [CONNECTION_PORT]);
   

  useEffect(() => {   
    socket.on("clienteConectou", (conversa) => { 
      dispatch(setConversa(conversa));
      dispatch(setLogin(1));
    });
    return () => socket.off('clienteConectou')    
  });

  useEffect(() => {   
    socket.on("atendimentoIniciou", (atendente) => { 
      dispatch(setAtendente(atendente));
      dispatch(setLogin(2));
    });
    return () => socket.off('atendimentoIniciou')    
  });

  const som = () => {

    let context,
    oscillator,
    contextGain,
    x = 1,
    type = 'sine';

    context = new AudioContext();
    oscillator = context.createOscillator();
    contextGain = context.createGain();
    
    oscillator.type = type;
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);
    contextGain.gain.exponentialRampToValueAtTime(
      0.00001, context.currentTime + x
    )
  }

  useEffect(()=>{
    dispatch(setNome(props.match.params.nome));
    if(stateChatCliente.nome!=""){
      conectarCliente();
    }
  },[])

  useEffect(() => {
    socket.on("receberMensagem", (mensagem) => {
      dispatch(addMensagem(mensagem));
      if(ref.current!=null){
        ref.current.scrollTo(0, ref.current.scrollHeight)
      }
      //som();
    });
    return () => socket.off('receberMensagem')
  });

  const conectarCliente = () => {
    console.log(stateChatCliente)
    const conversa = ({ nomeConversa: stateChatCliente.nome, tokenConversa:socket.id });
    socket.emit("conectarCliente", conversa);
  };



  const enviarMensagem = async () => {
    let mensagem = {
      idConversa: stateChatCliente.conversa.idConversa,
      idAtendente: stateChatCliente.atendente.idAtendente,
      enviou: '1',
      nomeAtendente: stateChatCliente.atendente.nomeAtendente,
      mensagem: stateChatCliente.mensagem,
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

  
  const chatHTML =
    <div className="chat">
      <div className="conversa"> 
      <div>Conversando com {stateChatCliente.atendente.nomeAtendente}</div>
      </div>
      <div className="conteudo-chat" ref={ref}>
        {
            Object.keys(stateChatCliente.mensagens).map(i => {
              return <div key={i}>
              {stateChatCliente.mensagens[i].enviou=='1'?
                <div className="divEnviou"  >
                      <label className="nomeEnviou" >Você</label><br></br>
                    {stateChatCliente.mensagens[i].mensagem}
                </div>:
                <div className="divRecebeu" >
                    <label className="nomeRecebeu" >{stateChatCliente.mensagens[i].nomeAtendente} - {stateChatCliente.mensagens[i].hora}s</label><br></br>
                  {stateChatCliente.mensagens[i].mensagem}
                </div>
                }
              </div>
            })
          }
    </div>
    <div className="enviarMensagem">
    <div className="row col-12">
        <div className="col-10">
        <textarea 
            spellCheck="true"
            placeholder="Digite a mensagem"
            rows="3"
            value={stateChatCliente.mensagem}
            onChange={(e) => dispatch(setMensagem(e.target.value))}
          />
        </div>
        <div className="col-2" >
          <br></br>
          <button className='botao_enviar' onClick={()=>enviarMensagem()}>Enviar</button>
        </div>
    </div>
    </div>
    </div>;

  const formularioHTML = 
  <div className='formulario'>
    <div className='bordaLogin' ></div>
    <input className='campoNome'
      type="text"
      maxLength="30"
      spellCheck="true"
      value={stateChatCliente.nome}
      onChange={(e) => {
        console.log(e.target.value)
        dispatch(setNome(e.target.value))
      }}
      required
    /> 
    <button className='botao' onClick={conectarCliente}>Login</button>
  </div>;

  const aguardandoHTML = 
  <div className='aguardando'>
    Aguardando atendimento...
  </div>;

  const erroHTML = 
  <div>Erro</div>;

  switch (stateChatCliente.login) {
    case 0:
      return formularioHTML;
    case 1:
      return aguardandoHTML;
    case 2:
      return chatHTML;
    default:
      return erroHTML
  }
}

export default ChatCliente;
