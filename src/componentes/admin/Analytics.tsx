import { useState, useEffect } from 'react';
import api from '../../api/api';

type AnalyticsData = {
    activeUsers: {
        count: number;
    };
    cartStatistics: {
        totalValue: number;
        avgCartValue: number;
        cartCount: number;
    };
    popularItems: Array<{
        _id: string, 
        name: string, 
        totalQuantity: number,
        totalRevenue: number 
    }>;
    topUsers: Array<{ 
        _id: string, 
        userName: string, 
        userEmail: string,
        totalSpent: number 
    }>;
};

function Analytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function fetchAnalytics() {
        setLoading(true);
        api.get('/admin/analytics') 
            .then(res => {
                setAnalytics(res.data.data); 
                setLoading(false);
            })
            .catch(err => {
                const errorMsg = `Erro ao buscar os dados de analytics: ${err.response?.data?.message || err.message}`;
                setError(errorMsg);
                setLoading(false);
                console.error(errorMsg);
            });
    }

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Carregando dados...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!analytics) {
        return <div className="text-center p-8">Nenhum dado para exibir.</div>;
    }

    // Variável para pegar o top produto de forma segura
    const topProduto = (analytics.popularItems && analytics.popularItems.length > 0) 
        ? analytics.popularItems[0] 
        : null;

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-[#344733]">Analytics do Sistema</h3>
                    <p className="text-sm text-[#8A9B6F] mt-1">
                        Visão geral das métricas mais importantes da plataforma.
                    </p>
                </div>
            </div>

            {/* Grid de cards*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B99375]/10 flex flex-col items-center justify-center">
                    <h4 className="text-lg font-semibold text-[#344733]">Usuários com Carrinhos</h4>
                    <p className="text-4xl font-bold text-[#8A9B6F] mt-2">
                        {analytics.activeUsers.count}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B99375]/10 flex flex-col items-center justify-center">
                    <h4 className="text-lg font-semibold text-[#344733]">Carrinhos Ativos</h4>
                    <p className="text-4xl font-bold text-[#8A9B6F] mt-2">
                        {analytics.cartStatistics.cartCount}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B99375]/10 flex flex-col items-center justify-center">
                    <h4 className="text-lg font-semibold text-[#344733]">Valor em Carrinhos</h4>
                    <p className="text-4xl font-bold text-[#8A9B6F] mt-2">
                        R$ {analytics.cartStatistics.totalValue.toFixed(2)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-[#B99375]/10 flex flex-col items-center justify-center">
                    <h4 className="text-lg font-semibold text-[#344733]">Ticket Médio (Carrinho)</h4>
                    <p className="text-4xl font-bold text-[#8A9B6F] mt-2">
                        R$ {analytics.cartStatistics.avgCartValue.toFixed(2)}
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card Principal: Top Produto */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-[#B99375]/10 flex flex-col justify-center">
                    <h4 className="text-lg font-semibold text-[#344733] text-center">Produto Mais Vendido</h4>
                    
                    {topProduto ? (
                        <div className="text-center mt-3">
                            <p className="text-xl font-bold text-[#8A9B6F]">
                                {topProduto.name}
                            </p>
                            <p className="text-3xl font-bold text-[#344733] mt-2">
                                {topProduto.totalQuantity}
                                <span className="text-base font-normal text-[#8A9B6F]"> unidades</span>
                            </p>
                        </div>
                    ) : (
                        <p className="text-center text-[#8A9B6F] mt-3">Nenhum item vendido.</p>
                    )}
                </div>

                {/* Lista: Outros Itens Populares */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-[#B99375]/10">
                    <h4 className="text-lg font-semibold text-[#344733] mb-4">Top 10 Itens Populares (por Quantidade)</h4>
                    
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                        {analytics.popularItems && analytics.popularItems.length > 0 ? (
                            analytics.popularItems.map((item, index) => (
                                <li key={item._id} className="flex justify-between items-center border-b border-[#B99375]/10 pb-2 pr-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`font-bold text-sm w-6 text-center ${index === 0 ? 'text-[#B99375]' : 'text-[#344733]'}`}>
                                            #{index + 1}
                                        </span>
                                        <span className="text-[#344733] font-medium">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-[#8A9B6F]">
                                        {item.totalQuantity} unidades
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="text-[#8A9B6F]">Nenhum dado de item encontrado.</p>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Analytics;