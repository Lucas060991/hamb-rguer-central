import { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { MenuScreen } from '@/components/MenuScreen';
import { CartScreen } from '@/components/CartScreen';
import { KitchenScreen } from '@/components/KitchenScreen';
import { PaymentScreen } from '@/components/PaymentScreen';
import { LogsScreen } from '@/components/LogsScreen';
import { FloatingCart } from '@/components/FloatingCart';
import { LoginModal } from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { api, Product } from '@/services/api'; // Importando da API
import {
  getCart,
  getOrdersByStatus,
  getLogs,
  CartItem,
  Order,
  LogEntry
} from '@/lib/storage'; // Importando do Storage novo

// Definindo as Abas disponíveis
type Tab = 'menu' | 'cart' | 'payment' | 'kitchen' | 'logs';

// Abas que precisam de senha (Admin)
const PROTECTED_TABS: Tab[] = ['kitchen', 'logs'];

const Index = () => {
  const { isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  // Estados de Dados
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentOrders, setPaymentOrders] = useState<Order[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 1. Função para carregar produtos do Google Sheets (API)
  const fetchMenuFromGoogle = useCallback(async () => {
    // Não ativa loading se já tiver produtos (para não piscar a tela)
    if (products.length === 0) setLoadingProducts(true);
    
    const cloudProducts = await api.getProducts();
    if (cloudProducts.length > 0) {
      setProducts(cloudProducts);
    }
    setLoadingProducts(false);
  }, []); // Dependências vazias para rodar apenas uma vez ou quando chamado

  // 2. Função para carregar dados locais (Carrinho, Pedidos)
  const refreshLocalData = useCallback(() => {
    setCart(getCart());
    setPaymentOrders(getOrdersByStatus('payment'));
    setKitchenOrders(getOrdersByStatus('kitchen'));
    setLogs(getLogs());
  }, []);

  // Effect Inicial (Roda ao abrir o site)
  useEffect(() => {
    fetchMenuFromGoogle();
    refreshLocalData();
  }, [fetchMenuFromGoogle, refreshLocalData]);

  // Handler: Quando um pedido é criado no Carrinho -> Vai para Pagamento
  const handleOrderCreated = () => {
    refreshLocalData();
    setActiveTab('payment'); // Redireciona o cliente para a tela de pagamento
  };

  // Handler: Troca de abas com proteção de senha
  const handleTabChange = (tab: Tab) => {
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      setPendingTab(tab);
      setShowLoginModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Handler: Login com sucesso
  const handleLoginSuccess = () => {
    login();
    setShowLoginModal(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={cartCount}
        paymentCount={paymentOrders.length}
        kitchenCount={kitchenOrders.length}
        isAuthenticated={isAuthenticated}
      />

      <LoginModal
        open={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingTab(null);
        }}
        onSuccess={handleLoginSuccess}
      />

      <main className="container mx-auto px-4 py-8">
        
        {/* ABA 1: CARDÁPIO */}
        {activeTab === 'menu' && (
          <>
            {loadingProducts ?
