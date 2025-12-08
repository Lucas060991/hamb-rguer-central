import { ShoppingCart } from 'lucide-react';

interface FloatingCartProps {
  count: number;
  onClick: () => void;
}

export function FloatingCart({ count, onClick }: FloatingCartProps) {
  if (count === 0) return null;

  return (
    <button onClick={onClick} className="floating-cart md:hidden">
      <ShoppingCart className="w-6 h-6" />
      <span className="cart-badge">{count}</span>
    </button>
  );
}
