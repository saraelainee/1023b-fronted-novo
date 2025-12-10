import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx' // Layout principal
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Importando todas as páginas
import Login from './componentes/login/login.tsx'
import Erro from './componentes/erro/erro.tsx'
import Produtos from './componentes/produtos/Produtos.tsx'
import Carrinho from './componentes/carrinho/carrinho.tsx'
import Admin from './componentes/admin/Admin.tsx'
import Registrar from './componentes/login/registrar.tsx'
import Checkout from './componentes/carrinho/chekout.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Erro />,
    children: [
      { index: true, element: <Produtos /> },
      { path: 'login', element: <Login /> },
      { path: 'carrinho', element: <Carrinho /> },
      { path: 'admin', element: <Admin /> },
      { path: 'registro', element: <Registrar /> },
      { path: 'checkout', element: <Checkout /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)