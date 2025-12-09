// src/lib/api.ts

// COLE AQUI A URL QUE VOCÊ COPIOU DO APPS SCRIPT
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/u/1/s/AKfycby2GVETeIl9Ol-Wh6kJzTkQk0Kxn3eayj-ram-RWgvSXbvge0MTij9wpPII1zkF18V3/exec";

export interface Produto {
  id: string | number;
  categoria: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
}

export interface Pedido {
  id_pedido: string;
  cliente: {
    nome: string;
    telefone: string;
    endereco_rua: string;
    endereco_numero: string;
    bairro: string;
  };
  tipo_entrega: string;
  forma_pagto: string;
  total: number;
  resumo_itens: string; // Texto formatado para impressão
  obs: string;
}

export const api = {
  // Buscar Cardápio
  getProdutos: async (): Promise<Produto[]> => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  // Enviar Pedido
  enviarPedido: async (pedido: Pedido) => {
    try {
      // O Google Apps Script exige 'no-cors' ou stringify especial, 
      // mas o fetch padrão com POST text/plain costuma funcionar melhor para evitar bloqueios de CORS simples
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(pedido)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      return { result: "erro" };
    }
  }
};
