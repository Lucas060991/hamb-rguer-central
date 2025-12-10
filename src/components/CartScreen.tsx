import { useState } from 'react';
import { Minus, Plus, Trash2, Truck, ShoppingBag, Loader2, Pencil, Check } from 'lucide-react'; // Adicionei Pencil e Check
import { CartItem, Customer, updateCartItemQuantity, createOrder, clearCart } from '@/lib/storage';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface CartScreenProps {
  cart: CartItem[];
  onCartChange: () => void;
  onOrderCreated: () => void;
}

export function CartScreen({ cart, onCartChange, onOrderCreated }: CartScreenProps) {
  const [isDelivery, setIsDelivery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- MUDANÇA 1: Frete agora é um estado (começa fixo em 5.00) ---
  const [deliveryFee, setDeliveryFee] = useState(5.00);
  const [isEditingFee, setIsEditingFee] = useState(false); // Controla se está editando
  
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    address: '',
    phone: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // --- MUDANÇA 2: Usa a variável deliveryFee no cálculo ---
  const total = subtotal + (isDelivery ? deliveryFee : 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
    onCartChange();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Carrinho vazio!');
      return;
    }

    if (!customer.name.trim()) {
      toast.error('Por favor, informe seu nome');
      return;
    }

    if (isDelivery && !customer.address.trim()) {
      toast.error('Por favor, informe o endereço para entrega');
      return;
    }

    setIsSubmitting(true);

    try {
      const localOrder = createOrder(customer, cart, isDelivery);
      
      const resumoImpressao = cart
        .map(item => `${item.quantity}x ${item.name} \n   (R$ ${(item.price * item.quantity).toFixed(2)})`)
        .join('\n----------------\n');

      const dadosParaPlanilha = {
        id_pedido: `#${localOrder.orderNumber}`,
        cliente: {
          nome: customer.name,
          telefone: customer.phone,
          endereco_rua: isDelivery ? customer.address : "Retirada no Balcão",
          endereco_numero: "", 
          bairro: "" 
        },
        tipo_entrega: isDelivery ? "Delivery" : "Retirada",
        forma_pagto: "A Combinar",
        total: total,
        resumo_itens: resumoImpressao,
        obs: `Taxa de entrega aplicada: R$ ${deliveryFee.toFixed(2)}` // Adicionei obs do frete
      };

      const sucesso = await api.createOrder(dadosParaPlanilha);

      if (sucesso) {
        toast.success(`Pedido #${localOrder.orderNumber} enviado para a cozinha!`);
        setCustomer({ name: '', address: '', phone: '' });
        setIsDelivery(false);
        clearCart();
        onOrderCreated();
      } else {
        toast.error("Erro ao conectar com a cozinha. Tente novamente.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao enviar pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <ShoppingBag className="w-24 h-24 text-muted-foreground/30 mb-6" />
        <h2 className="text-2xl font-display text-muted-foreground mb-2">CARRINHO VAZIO</h2>
        <p className="text-muted-foreground">Adicione itens do cardápio para começar</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-3xl font-display text-foreground mb-6">CARRINHO</h2>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
        {cart.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 ${
              index !== cart.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{item.name}</h4>
              <p className="text-sm text-primary font-medium">
                R$ {item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                disabled={isSubmitting}
              >
                {item.quantity === 1 ? (
                  <Trash2 className="w-4 h-4 text-destructive" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="font-bold text-foreground min-w-[80px] text-right">
              R$ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Dados do Cliente</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do cliente *"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="input-field"
              required
              disabled={isSubmitting}
            />
            <input
              type="tel"
              placeholder="Telefone (WhatsApp)"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="input-field"
              disabled={isSubmitting}
            />
            
            <label className="flex items-center gap-3 cursor-pointer py-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isDelivery}
                  onChange={(e) => setIsDelivery(e.target.checked)}
                  className="sr-only peer"
                  disabled={isSubmitting}
                />
                <div className="w-6 h-6 rounded border-2 border-border peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {isDelivery && <Truck className="w-4 h-4 text-primary-foreground" />}
                </div>
              </div>
              <span className="text-foreground">
                 {/* Mostra o valor atualizado dinamicamente no checkbox também */}
                 Para Entrega? (+R$ {deliveryFee.toFixed(2)})
              </span>
            </label>

            {isDelivery && (
              <input
                type="text"
                placeholder="Endereço completo *"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="input-field animate-slide-in"
                required
                disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            
            {isDelivery && (
              <div className="flex justify-between items-center text-muted-foreground animate-slide-in">
                <span>Taxa de Entrega</span>
                
                {/* --- MUDANÇA 3: UI de Edição do Frete --- */}
                <div className="flex items-center gap-2">
                  {isEditingFee ? (
                    // Modo Edição: Input numérico
                    <div className="flex items-center gap-1">
                        <span className="text-sm">R$</span>
                        <input 
                            type="number"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(Number(e.target.value))}
                            className="w-20 p-1 border border-primary rounded text-right text-foreground bg-background"
                            step="0.50"
                            min="0"
                        />
                        <button 
                            type="button" 
                            onClick={() => setIsEditingFee(false)}
                            className="p-1 hover:bg-secondary rounded"
                        >
                            <Check className="w-4 h-4 text-green-500" />
                        </button>
                    </div>
                  ) : (
                    // Modo Visualização: Texto + Ícone Lápis
                    <>
                        <span>R$ {deliveryFee.toFixed(2)}</span>
                        <button 
                            type="button" 
                            onClick={() => setIsEditingFee(true)}
                            className="text-primary hover:text-primary/80 transition-colors ml-1"
                            title="Editar valor do frete"
                        >
                            <Pencil className="w-3 h-3" />
                        </button>
                    </>
                  )}
                </div>
                {/* ------------------------------------- */}
                
              </div>
            )}
            
            <div className="flex justify-between text-xl font-bold text-foreground pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando Pedido...
              </>
            ) : (
              "Confirmar Pedido"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
