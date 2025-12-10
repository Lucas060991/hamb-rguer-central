// src/services/api.ts

// 🔴 ATENÇÃO: SE VOCÊ GEROU UMA NOVA IMPLANTAÇÃO, A URL MUDOU! PEGUE A NOVA URL.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpObZeKRktK6XyqUEcPO_Yc-q4fmn3nwhXlRS21ZP1WB3-fWEWREHQAmf0hn9BFC0/exec";

// ... interfaces (Product, OrderData, etc) mantêm igual ...

export const api = {
  getProducts: async (): Promise<Product[]> => {
    try {
      // GET não precisa de configurações especiais se o script for Público
      const response = await fetch(GOOGLE_SCRIPT_URL);
      
      if (!response.ok) throw new Error('Falha na rede');
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        id: String(item.id),
        name: item.nome,
        description: item.descricao,
        price: Number(item.preco),
        category: item.categoria,
        image: item.imagem_url
      }));
    } catch (error) {
      console.error("Erro ao carregar cardápio:", error);
      return [];
    }
  },

  // Função Genérica para enviar dados (POST)
  // O TRUQUE: Usamos JSON.stringify mas não mandamos o header 'application/json'
  // Isso evita o 'Preflight' do CORS que estava bloqueando você.
  _sendData: async (payload: any) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        // removemos o 'mode: no-cors' e 'headers' para deixar o navegador decidir o padrão (text/plain)
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar:", error);
      return false;
    }
  },

  createOrder: async (order: OrderData) => {
    return api._sendData({
      action: 'create_order',
      ...order
    });
  },

  addProduct: async (product: NewProductData) => {
    const payload = {
      action: 'create_product',
      nome: product.name,
      descricao: product.description,
      preco: product.price,
      category: product.category,
      imagem_url: product.image
    };
    return api._sendData(payload);
  }
};
