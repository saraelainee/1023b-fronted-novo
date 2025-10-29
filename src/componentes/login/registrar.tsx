import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";

function Registrar() {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [idade, setIdade] = useState<number | "">("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function interpretaForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const payload = { nome, email, idade: Number(idade), senha };
            const resposta = await api.post("/adicionarUsuario", payload);
            if (resposta.status === 201) {
                navigate("/login");
            }
        } catch (err: any) {
            const msg = err?.response?.data?.mensagem || err?.mensagem || "Erro desconhecido!"
            console.log(err);
            setError(msg);
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-800">Registre-se</h1>

                    {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

                    <form onSubmit={interpretaForm} className="space-y-3">
                        <input
                            name="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="Nome"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="exemplo@ex.com"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                            name="idade"
                            type="number"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value ? Number(e.target.value) : "")}
                            min={0}
                            placeholder="Idade"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                            name="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            placeholder="Senha segura"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {loading ? "Criando..." : "Criar conta"}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-gray-600">
                        Já possui conta? <Link to="/login" className="text-indigo-600 hover:underline">Entre Aqui</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Registrar;
