import './App.css'
//Useffect
import { useEffect } from 'react'
import { useState } from 'react'
type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}


function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  useEffect(() => {
    fetch('/api/produtos')
      .then((response) => response.json())
      .then((data) => setProdutos(data))
  }, [])
  return(
    <>
    <div>Sarinha</div>
    {produtos.map((produtos) =>(
      <div key={produtos._id}>
        <h2>{produtos.nome}</h2>
        <p>{produtos.preco}</p>
        <img src={produtos.urlfoto} alt={produtos.nome} width="200" />
        <p>{produtos.descricao}</p>
      </div>
    ))}
    </>
  )
}

export default App
