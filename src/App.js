import './App.css';

import {Switch, Route, Link} from 'react-router-dom';
import ChatCliente from './chat_cliente/ChatCliente';
import ChatAtendente from './chat_atendente/ChatAtendente'; 
import {Provider} from 'react-redux';
import store from './redux/store';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';




function App() {
  {
  /*
  <header>
    <Link to='/LoginCliente'>LoginCliente</Link>
    <br/>
    <Link to='/LoginAtendente'>LoginAtendente</Link>
  </header>
  */
 }
  return (
    <>
      <main>
        <ReactNotification />
        <Provider store={store}>
          <Switch>
            <Route path='/ChatCliente' component={ChatCliente}/>
            <Route path='/ChatAtendente' component={ChatAtendente}/>
          </Switch>
        </Provider>
      </main>
    </>
  );
}

export default App;
