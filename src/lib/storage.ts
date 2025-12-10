// src/lib/storage.ts

// --- TIPOS (Definidos localmente para evitar erros de importação) ---
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

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
  status: 'payment' | 'kitchen' | 'completed'; // Fluxo: Pagamento -> Cozinha -> Histórico
  timestamp: number;
  isDelivery: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
}

// --- FUNÇÕES SEGURAS (SAFE PARSE) ---

// Função auxiliar para ler do localStorage sem quebrar
const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Erro ao ler ${key}, resetando dados.`, error);
    localStorage.removeItem(key); // Limpa o dado corrompido
    return fallback;
  }
};

// --- CARRINHO ---

export const getCart = (): CartItem[] => safeGet('hamb_central_cart', []);

export const addToCart = (product: Product) => {
  const cart = getCart();
  // Converte IDs para string para evitar duplicação
  const index = cart.findIndex(item => String(item.id) === String(product.id));
  
  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('hamb_central_cart', JSON.stringify(cart));
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  const cart = getCart();
  let newCart;
  if (quantity < 1) {
    newCart = cart.filter(item => String(item.id) !== String(productId));
  } else {
    newCart = cart.map(item => String(item.id) === String(productId) ? { ...item, quantity } : item);
  }
  localStorage.setItem('hamb_central_cart', JSON.stringify(newCart));
};

export const clearCart = () => localStorage.removeItem('hamb_central_cart');

// --- PEDIDOS (ORDER FLOW) ---

export const createOrder = (customer: Customer, items: CartItem[], isDelivery: boolean): Order => {
  const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
  
  const newOrder: Order = {
    id: crypto.randomUUID(),
    orderNumber,
    items,
    customer,
    total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + (isDelivery ? 5 : 0),
    status: 'payment', // Começa SEMPRE no pagamento
    timestamp: Date.now(),
    isDelivery
  };

  // Salva na lista de Pagamento
  const paymentOrders = getOrdersByStatus('payment');
  localStorage.setItem('hamb_central_orders_payment', JSON.stringify([...paymentOrders, newOrder]));
  
  return newOrder;
};

export const getOrdersByStatus = (status: string): Order[] => {
  return safeGet(`hamb_central_orders_${status}`, []);
};

export const updateOrderStatus = (orderId: string, newStatus: 'kitchen' | 'completed') => {
  // Pega todas as listas possíveis para achar o pedido onde quer que ele esteja
  const paymentOrders = getOrdersByStatus('payment');
  const kitchenOrders = getOrdersByStatus('kitchen');
  
  // Encontra o pedido
  let order = paymentOrders.find(o => o.id === orderId) || kitchenOrders.find(o => o.id === orderId);

  if (!order) return; // Se não achar, aborta

  // Remove das listas antigas
  const newPayment = paymentOrders.filter(o => o.id !== orderId);
  const newKitchen = kitchenOrders.filter(o => o.id !== orderId);
  
  localStorage.setItem('hamb_central_orders_payment', JSON.stringify(newPayment));
  localStorage.setItem('hamb_central_orders_kitchen', JSON.stringify(newKitchen));

  // Adiciona na nova lista
  order.status = newStatus;

  if (newStatus === 'kitchen') {
    // Vai para cozinha
    localStorage.setItem('hamb_central_orders_kitchen', JSON.stringify([...newKitchen, order]));
  } else if (newStatus === 'completed') {
    // Vai para o histórico de logs local
    addLog('Pedido Finalizado', `Pedido #${order.orderNumber} finalizado.`);
  }
};

// --- LOGS ---

export const getLogs = (): LogEntry[] => safeGet('hamb_central_logs', []);

export const addLog = (action: string, details: string) => {
  const logs = getLogs();
  const newLog = { id: crypto.randomUUID(), timestamp: Date.now(), action, details };
  localStorage.setItem('hamb_central_logs', JSON.stringify([newLog, ...logs].slice(0, 50)));
};

// --- STUBS (Para evitar erro em arquivos antigos) ---
export const getProducts = () => [];
export const addProduct = () => {};
export const updateProduct = () => {};
export const deleteProduct = () => {};
