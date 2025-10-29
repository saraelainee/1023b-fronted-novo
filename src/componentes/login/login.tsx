// ARQUIVO: src/componentes/login/login.tsx (MODIFICADO)
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode"; // TAREFA VÂNIA: Importa o decoder

// Define a estrutura esperada do nosso Token
interface DecodedToken {
    usuarioId: string;
    role: string;
    nome: string;
    // (outros campos como 'iat', 'exp'...)
}

function Login() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    
    // TAREFA SARA: Exibe mensagens amigáveis (esta parte já existia)
    const mensagem = searchParams.get("mensagem")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const senha = formData.get("senha")

        api.post("/login", {
            email,
            senha
        }).then(resposta => {
            if (resposta.status === 200) {
                const token = resposta?.data?.token;

                // --- INÍCIO DA TAREFA DA VÂNIA ---
                localStorage.setItem("token", token); // 1. Armazena o Token

                // 2. Decodifica o token para pegar as infos
                const decoded = jwtDecode<DecodedToken>(token);

                // 3. Armazena o tipo e o nome no localStorage
                localStorage.setItem("tipoUsuario", decoded.role); 
                localStorage.setItem("nomeUsuario", decoded.nome);
                // --- FIM DA TAREFA DA VÂNIA ---

                // Redireciona para a página principal
                navigate("/"); 
            }
        }).catch((error: any) => {
            // TAREFA SARA: Mensagem amigável de erro de login
            const msg = error?.response?.data?.mensagem ||
                error?.response?.data?.error || // Pega o 'error' também
                error?.message ||
                "Erro Desconhecido!"
            navigate(`/login?mensagem=${encodeURIComponent(msg)}`)
        })
    }


    return (
        <>
            <h1>Login</h1>
            {/* TAREFA SARA: Exibe a mensagem de erro */}
            {mensagem && <p style={{ color: 'red' }}>{mensagem}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" name="email" id="email" />
                <br/>
                <label htmlFor="senha">Senha:</label>
                <input type="password" name="senha" id="senha" />
                <br/>
                <button type="submit">Entrar</button>
            </form>
        </>
    )
}
export default Login;