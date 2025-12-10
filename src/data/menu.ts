export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export const menuItems: Product[] = [
  {
    id: 1,
    name: "BIG-BASIC",
    description: "Pão artesanal, smash 100g, cheddar, molho.",
    price: 12.99,
    category: "Burgers",
    image: "/images/big-basic.jpg" // Placeholder para imagem futura
  },
  {
    id: 2,
    name: "BIG-CLASSIC",
    description: "Pão artesanal, smash 100g, cheddar, cebola roxa e molho.",
    price: 15.00,
    category: "Burgers"
  },
  {
    id: 3,
    name: "BIG-BURGER",
    description: "Pão artesanal, blend 150g, cheddar, cebola caramelizada, picles, barbecue e molho.",
    price: 17.00,
    category: "Burgers"
  },
  {
    id: 4,
    name: "BIG-SALADA",
    description: "Pão artesanal, blend 150g, salada, cheddar, cebola caramelizada, picles, barbecue, molho e cream cheese.",
    price: 20.00,
    category: "Burgers"
  },
  {
    id: 5,
    name: "BIG-DOUBLÉ",
    description: "Pão artesanal, 2 smash de 100g, cheddar, cebola caramelizada, picles, barbecue, cream cheese.",
    price: 25.00,
    category: "Burgers"
  },
  {
    id: 6,
    name: "BIG-FOME",
    description: "Pão artesanal, blend 200g, picles, cebola caramelizada, cheddar, barbecue, molho e cream cheese.",
    price: 30.00,
    category: "Burgers"
  },
  {
    id: 7,
    name: "BIG-BACON",
    description: "Pão artesanal, 2 smash de 100g, bacon fatiado, picles, cebola caramelizada, barbecue, molho e cream cheese.",
    price: 33.00,
    category: "Burgers"
  },
  {
    id: 8,
    name: "BIG-MONSTER",
    description: "3 smash de 100g, bacon fatiado, cebola caramelizada, picles, cheddar, barbecue, molho e cream cheese.",
    price: 35.00,
    category: "Burgers"
  }
];
