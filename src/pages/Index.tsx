import { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { MenuScreen } from '@/components/MenuScreen';
import { CartScreen } from '@/components/CartScreen';
import { KitchenScreen } from '@/components/KitchenScreen';
import { PaymentScreen } from '@/components/PaymentScreen';
import { LogsScreen } from '@/components/LogsScreen';
import { FloatingCart } from '@/components/FloatingCart';
import {
  getProducts,
  getCart,
  getOrdersByStatus,
  getLogs,
  Product,
  CartItem,
  Order,
  LogEntry,
} from '@/lib/storage';

type Tab = 'menu' | 'cart' | 'kitchen' | 'payment' | 'logs';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);
  const [paymentOrders, setPaymentOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const refreshData = useCallback(() => {
    setProducts(getProducts());
    setCart(getCart());
    setKitchenOrders(getOrdersByStatus('kitchen'));
    setPaymentOrders(getOrdersByStatus('payment'));
    setLogs(getLogs());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleOrderCreated = () => {
    refreshData();
    setActiveTab('kitchen');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartCount}
        kitchenCount={kitchenOrders.length}
        paymentCount={paymentOrders.length}
      />

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'menu' && (
          <MenuScreen
            products={products}
            onProductsChange={refreshData}
            onAddToCart={refreshData}
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            cart={cart}
            onCartChange={refreshData}
            onOrderCreated={handleOrderCreated}
          />
        )}

        {activeTab === 'kitchen' && (
          <KitchenScreen
            orders={kitchenOrders}
            onOrdersChange={refreshData}
          />
        )}

        {activeTab === 'payment' && (
          <PaymentScreen
            orders={paymentOrders}
            onOrdersChange={refreshData}
          />
        )}

        {activeTab === 'logs' && (
          <LogsScreen
            logs={logs}
            onLogsChange={refreshData}
          />
        )}
      </main>

      <FloatingCart
        count={cartCount}
        onClick={() => setActiveTab('cart')}
      />
    </div>
  );
};

export default Index;
