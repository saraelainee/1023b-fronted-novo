import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import api from "../../api/api"; // Sua instância do Axios configurada

// Sua chave PÚBLICA (pk_test_...)
const stripePromise = loadStripe("pk_test_51SXjtDKf3HU4ogeyckeHudPj3cOdCpQ14quWFzmMVjvilrYhD95dA8MXtgkV2O0buvXo3Sxs6UOOaHuk572Sjkmc00PYKwRYho");

export default function Checkout() {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Chama seu backend para criar a sessão com o valor do carrinho
        api.post("/carrinho/checkout")
            .then((res) => {
                setClientSecret(res.data.clientSecret);
            })
            .catch((err) => {
                console.error("Erro ao iniciar checkout", err);
                alert("Erro ao iniciar pagamento. Verifique se o carrinho não está vazio.");
            });
    }, []);

    // Só renderiza o Stripe se tivermos o segredo
    if (!clientSecret) {
        return <div className="p-10 text-center">Carregando pagamento...</div>;
    }

    return (
        <div id="checkout" className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-[#344733]">Finalizar Compra</h1>
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
}