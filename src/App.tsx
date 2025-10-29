// ARQUIVO: src/App.tsx (FRONTEND)
// Este arquivo NÃO deve mais ter a lista de produtos!
// Ele agora é SÓ o Layout.

import { Outlet } from 'react-router-dom'
// Verifique se o caminho de importação do Header está correto
import Header from './componentes/layout/Header.tsx' 
import './App.css'

function App() {
  return (
    <>
      {/* 1. O Header (cabeçalho) é exibido */}
      <Header /> 
      
      <main className="container">
        {/* 2. AQUI é onde as rotas filhas (Produtos, Carrinho, Admin)
          serão desenhadas. Sem o <Outlet />, a página fica em branco.
        */}
        <Outlet /> 
      </main>
    </>
  )
}

export default App