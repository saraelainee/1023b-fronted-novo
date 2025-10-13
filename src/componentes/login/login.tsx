import { useSearchParams, useNavigate } from "react-router-dom"
import api from "../../api/api"

function Login() {
    const navigate = useNavigate()
    //url localhost:5173/login?message=Token Inválido!
    //para pegar a menssagem passada pela url usamos o 
    const [searchParams] = useSearchParams()
    const mensagem = searchParams.get("message")
    function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        //vamos pegar o q a pessoa digitar
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const senha = formData.get("senha")

        //chamar API.post
        api.post("/login",{
            email,
            senha
        }).then(resposta=>{
            if(resposta.status ===200){
                localStorage.setItem("token", resposta?.data?.token)
                navigate("/")
            }
            else if(resposta.status === 400){
                navigate(`/loginmessage=${resposta?.data?.message}`)
            }
        })

        //ver a resposta da api

    }


    return(
    <>
    <h1>Login</h1>
    {mensagem && <p>{mensagem}</p>}
    <form onSubmit={handleSubmit}>
        <input type="text" name="email" id="email" />
        <input type="password" name="senha" id="senha" />
        <button type="submit">Entrar</button>
    </form>
    </>
    )
}

export default Login