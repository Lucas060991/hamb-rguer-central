import { Product } from '@/services/api'; // Importa a definição da API

export type { Product }; // Re-exporta para usar nos componentes

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer: Customer;
  total: number;
  status: 'kitchen' | 'payment' | 'completed';
  timestamp: number;
  isDelivery: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
}

// --- FUNÇÕES DO CARRINHO ---

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('hamb_central_cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Product) => {
  const cart = getCart();
  
  // O SEGREDO ESTÁ AQUI: Verifica pelo ID se o item já existe
  // Convertemos para String para garantir que "100" (number) seja igual a "100" (string)
  const existingItemIndex = cart.findIndex(item => String(item.id) === String(product.id));

  if (existingItemIndex > -1) {
    // Se existe, só aumenta a quantidade
    cart[existingItemIndex].quantity += 1;
  } else {
    // Se não existe, adiciona como novo
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('hamb_central_cart', JSON.stringify(cart));
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  const cart = getCart();
  
  if (quantity < 1) {
    // Se quantidade for 0, remove o item
    const newCart = cart.filter(item => String(item.id) !== String(productId));
    localStorage.setItem('hamb_central_cart', JSON.stringify(newCart));
    return;
  }

  // Atualiza a quantidade
  const newCart = cart.map(item => 
    String(item.id) === String(productId) ? { ...item, quantity } : item
  );
  
  localStorage.setItem('hamb_central_cart', JSON.stringify(newCart));
};

export const clearCart = () => {
  localStorage.removeItem('hamb_central_cart');
};

// --- FUNÇÕES DE PEDIDOS E LOGS (Mantendo compatibilidade) ---

export const createOrder = (customer: Customer, items: CartItem[], isDelivery: boolean): Order => {
  const orders = getOrdersByStatus('kitchen'); // Pega existentes ou array vazio
  
  const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
  
  const newOrder: Order = {
    id: crypto.randomUUID(),
    orderNumber,
    items,
    customer,
    total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + (isDelivery ? 5 : 0),
    status: 'kitchen',
    timestamp: Date.now(),
    isDelivery
  };

  // Salva no LocalStorage (Kitchen)
  const allKitchenOrders = [...getOrdersByStatus('kitchen'), newOrder];
  localStorage.setItem('hamb_central_orders_kitchen', JSON.stringify(allKitchenOrders));
  
  // Log
  addLog(`Pedido #${orderNumber} criado`, `Cliente: ${customer.name}`);

  return newOrder;
};

export const getOrdersByStatus = (status: string): Order[] => {
  const stored = localStorage.getItem(`hamb_central_orders_${status}`);
  return stored ? JSON.parse(stored) : [];
};

export const addLog = (action: string, details: string) => {
  const logs = getLogs();
  const newLog: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    action,
    details,
  };
  localStorage.setItem('hamb_central_logs', JSON.stringify([newLog, ...logs].slice(0, 50)));
};

export const getLogs = (): LogEntry[] => {
  const logs = localStorage.getItem('hamb_central_logs');
  return logs ? JSON.parse(logs) : [];
};

// Funções dummy para compatibilidade se o arquivo antigo tiver
export const addProduct = (p: any) => {}; 
export const updateProduct = (id: any, p: any) => {};
export const deleteProduct = (id: any) => {};
