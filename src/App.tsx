import { Outlet } from 'react-router-dom'
// Verifica se o caminho de importação do Header está correto
import Header from './componentes/layout/Header.tsx' 
import './App.css'

function App() {
  return (
    <>
      {/* 1. O Header*/}
      <Header /> 
      
      <main className="container">
        {/* 2. rotas filhas (Produtos, Carrinho, Admin)
        */}
        <Outlet /> 
      </main>
    </>
  )
}

export default App