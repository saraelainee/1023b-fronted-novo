import { useNavigate, useSearchParams} from "react-router-dom";

//criando a estrutura do componente Carrinho
function Carrinho(){
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    return(
        <>
        <h1>Carrinho de Compras</h1>
        <p>Em construção...</p>
        </>
    )
}
export default Carrinho;

