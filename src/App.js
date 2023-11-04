import {BrowserRouter, Routes , Route, Navigate} from 'react-router-dom'
import CrearCuenta from './components/CrearCuenta'
import Login from './components/Login'
import Inicio from './components/inicio'
import Registro from './components/Registro'
import Nuevocliente from './components/Nuevocliente'
import Resultado from './components/Resultado'
import Dashboard from './components/Dashboard'
import Correo from './components/Correo'
import StoreProvider from './components/StoreProvider'

export default function App(){
  return(
    <StoreProvider>   
      <BrowserRouter>

      <Routes>
        <Route path='/crearcuenta' element={<CrearCuenta />} />
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/inicio' element={<Inicio />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/agregarcliente' element={<Nuevocliente/>} />
        <Route path='/agregarcliente/:id' element={<Nuevocliente/>} />
        <Route path='/resultado' element={<Resultado/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/correo" element={<Correo/>}/>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    
      </BrowserRouter>
    </StoreProvider> 
  );
}