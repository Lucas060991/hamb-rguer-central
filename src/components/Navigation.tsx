import { UtensilsCrossed, ShoppingBag, CreditCard, ChefHat, ScrollText } from 'lucide-react';

type Tab = 'menu' | 'cart' | 'kitchen' | 'payment' | 'logs';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  cartCount: number;
  kitchenCount: number;
  paymentCount: number;
  isAuthenticated: boolean;
}

export function Navigation({ 
  activeTab, 
  onTabChange, 
  cartCount, 
  kitchenCount, 
  paymentCount,
  isAuthenticated 
}: NavigationProps) {
  
  // Função auxiliar para renderizar botões com estilo consistente
  const NavButton = ({ tab, icon: Icon, label, count, badgeColor }: any) => (
    <button
      onClick={() => onTabChange(tab)}
      className={`relative flex flex-col items-center justify-center p-2 min-w-[64px] rounded-lg transition-all ${
        activeTab === tab 
          ? 'text-primary bg-primary/10' 
          : 'text-muted-foreground hover:bg-secondary/50'
      }`}
    >
      <div className="relative">
        <Icon className={`w-6 h-6 ${activeTab === tab ? 'stroke-[2.5px]' : ''}`} />
        {count > 0 && (
          <span className={`absolute -top-2 -right-2 ${badgeColor || 'bg-red-500'} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-background`}>
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border pb-safe pt-2 px-4 z-50 md:sticky md:top-0 md:border-b md:border-t-0 md:bg-background/95">
      <div className="container mx-auto max-w-4xl flex items-center justify-between md:justify-center md:gap-8">
        
        {/* 1. CARDÁPIO */}
        <NavButton 
          tab="menu" 
          icon={UtensilsCrossed} 
          label="Cardápio" 
        />

        {/* 2. CARRINHO */}
        <NavButton 
          tab="cart" 
          icon={ShoppingBag} 
          label="Carrinho" 
          count={cartCount} 
        />

        {/* 3. PAGAMENTO (Movido para antes da Cozinha) */}
        <NavButton 
          tab="payment" 
          icon={CreditCard} 
          label="Pagamento" 
          count={paymentCount}
          badgeColor="bg-blue-500"
        />

        {/* 4. COZINHA */}
        <NavButton 
          tab="kitchen" 
          icon={ChefHat} 
          label="Cozinha" 
          count={kitchenCount}
          badgeColor="bg-orange-500"
        />

        {/* 5. HISTÓRICO */}
        <NavButton 
          tab="logs" 
          icon={ScrollText} 
          label="Histórico" 
        />

      </div>
    </nav>
  );
}
