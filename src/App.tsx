import './App.css'
import api from './api/api'
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
  api.get('/produtos')
    .then((response) => setProdutos(response.data)) 
    .catch((error) => console.error('Error fetching data:',error));
}, []);


//Função do form
  function handleForm(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    }
    fetch('/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((newProduto) => setProdutos([...produtos, newProduto]))
    .catch((error) => console.error('Erro ao cadastrar produto:', error));
    form.reset()
  }

//Função do carrinhoooooooooo
  function adicionarCarrinho(produtoId:string) {
    const clienteId = "12345"
    fetch('/api/carrinho', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ produtoId, clienteId })
    })
  }
  
  return (
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
        <button onClick={()=>adicionarCarrinho(produtos._id)}>Adicionar ao carrinho</button>
      </div>
    ))}
    </>
  )
}

export default App