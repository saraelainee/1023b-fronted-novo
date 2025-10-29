import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx' // Layout principal
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importando todas as  páginas
import Login from './componentes/login/login.tsx'
import Erro from './componentes/erro/erro.tsx'
import Produtos from './componentes/produtos/Produtos.tsx' 
import Carrinho from './componentes/carrinho/carrinho.tsx' 
import Admin from './componentes/admin/Admin.tsx'       
import Registrar from './componentes/login/registrar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas que NÃO têm o cabeçalho */}
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Erro />} />

        {/* AQUI É A MUDANÇA PRINCIPAL:
          O <App /> é o "Elemento Pai" (Layout) que contém o Header.
          As rotas "filhas" (path="/", "/carrinho", "/admin") 
          serão renderizadas DENTRO do <App /> onde está o <Outlet />.
        */}
        <Route element={<App />}>
          <Route path="/" element={<Produtos />} />
          <Route path='/registro' element={<Registrar />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)