import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode"; // TAREFA VÂNIA: Importa o decoder

// Define a estrutura esperada do nosso Token
interface DecodedToken {
    usuarioId: string;
    role: string;
    nome: string;
    // (outros campos como 'iat', 'exp'...)?????
}

function Login() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    
    // TAREFA SARA: Exibe mensagens amigáveis BLA BLA BLA
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

                // --- INICIO DA TAREFA DA VÂNIA ---
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
            // TAREFA SARA: Mensagem amigável de erro de login BLA BLA BLA
            const msg = error?.response?.data?.mensagem ||
                error?.response?.data?.error || // Pega o 'error' também
                error?.message ||
                "Erro Desconhecido!"
            navigate(`/login?mensagem=${encodeURIComponent(msg)}`)
        })
    }


    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F3F4FD] to-white p-6">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6">
                    <h1 className="text-2xl font-semibold mb-4 text-[#344733]">Entrar</h1>

                    {/* Exibe a mensagem de erro/aviso */}
                    {mensagem && <div className="mb-4 text-sm text-red-600">{mensagem}</div>}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            name="email"
                            type="text"
                            id="email"
                            required
                            placeholder="exemplo@ex.com"
                                className="w-full px-4 py-2 border border-[#B99375] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F]"
                        />
                        <input
                            name="senha"
                            type="password"
                            id="senha"
                            required
                            placeholder="Senha"
                                className="w-full px-4 py-2 border border-[#B99375] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F]"
                        />

                        <div className="flex gap-3 items-center">
                            <button
                                type="submit"
                                className="flex-1 bg-[#8A9B6F] text-white py-2 rounded-md hover:opacity-95 transition disabled:opacity-60 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-[#344733]">
                        Não possui conta? <Link to="/registro" className="text-[#8A9B6F] hover:underline">Crie uma</Link>
                    </p>
                </div>
            </div>
        </>
    )
}
export default Login;