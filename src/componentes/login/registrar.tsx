import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate()

function Registrar() {

    function interpretaForm(event: React.FormEvent<HTMLFormElement>) {

    }

    const response = api.post(
        "./adicionarUsuario", {
        //nome,
        //email,
        //idade,
        //senha
    }
    )
        .then(resposta => {
            if (resposta.status === 200) {
                localStorage.setItem("token", resposta?.data?.token)
                navigate("/")
            }
        }).catch((error: any) => {
            const msg = error?.response?.data?.mensagem ||
                error?.mensagem ||
                "Erro Desconhecido!"
            navigate(`/login?mensagem=${encodeURIComponent(msg)}`)
        })

    return (

        <>
            <h1>Registre-se aqui!</h1>
            <form onSubmit={interpretaForm}>
                <input type="text" placeholder="UserName" />
                <input type="email" placeholder="example@example.com" />
                <input type="number" placeholder="idade" />
                <input type="password" placeholder="Examplo@123" />
            </form>

            <p className="conta">Já possui conta? Entre <a href="#">Aqui</a></p>
        </>

    )
}
