import { useSearchParams, Link } from "react-router-dom";

function Erro() {
    const [searchParams] = useSearchParams()
    const mensagem = searchParams.get("mensagem")

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-6 mt-20">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-8 border border-[#B99375]/10">
                <div className="flex items-start gap-6">
                    <div className="text-6xl">⚠️</div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#344733]">Página de Erro</h1>
                        {mensagem ? (
                            <p className="mt-3 text-sm text-[#8A9B6F]">{mensagem}</p>
                        ) : (
                            <p className="mt-3 text-sm text-[#8A9B6F]">Ops! Algo deu errado.</p>
                        )}

                        <div className="mt-6">
                            <Link
                                to='/'
                                className="inline-block bg-[#8A9B6F] text-white px-5 py-3 rounded-md shadow-sm hover:opacity-90"
                            >
                                Volte à Home!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Erro;