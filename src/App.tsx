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
      .catch((error) => console.error('Erro ao buscar produtos:', error));
  }, [])
  function handleForm(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    fetch('/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
  }

  return(
    <>
    <div>Cadastro de Produtos</div>
    <form onSubmit={handleForm}>
      <input type="text" name="nome" placeholder="Nome" /><br />
      <input type="number" name="preco" placeholder="Preço" /><br />
      <input type="text" name="urlfoto" placeholder="Url da Foto" /><br />
      <textarea name="descricao" placeholder="Descrição"></textarea><br />
      <button type="submit">Cadastrar</button>
    </form>

    <div>Lista de Produtos</div>

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