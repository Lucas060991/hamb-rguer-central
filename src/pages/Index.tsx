import { Menu } from "../components/Menu";

const Index = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero Section (Capa) */}
      <section className="relative h-[50vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop')] bg-cover bg-center">
        {/* Overlay escuro para o texto ficar legível */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 text-center space-y-4 px-4">
          <div className="inline-block border-2 border-yellow-500 px-4 py-1 rounded-full mb-4">
            <span className="text-yellow-500 font-bold tracking-wider text-sm uppercase">Desde 2025</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-2">
            CENTRAL <span className="text-yellow-500">BURGUER</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto">
            O verdadeiro sabor artesanal. Ingredientes premium, smash burger suculento e aquele toque especial que você só encontra aqui.
          </p>
          <button className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20">
            Fazer Pedido
          </button>
        </div>
      </section>

      {/* Seção do Cardápio */}
      <div className="bg-zinc-950 pb-20 pt-10">
        <Menu />
      </div>

      {/* Rodapé Simples */}
      <footer className="bg-zinc-900 py-8 text-center text-zinc-500 text-sm border-t border-zinc-800">
        <p>&copy; 2025 Central Burguer. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
