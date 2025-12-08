import { FileText, Trash2 } from 'lucide-react';
import { LogEntry, getLogs, clearLogs } from '@/lib/storage';
import { toast } from 'sonner';

interface LogsScreenProps {
  logs: LogEntry[];
  onLogsChange: () => void;
}

export function LogsScreen({ logs, onLogsChange }: LogsScreenProps) {
  const handleClearLogs = () => {
    if (confirm('Limpar todo o histórico de pedidos?')) {
      clearLogs();
      onLogsChange();
      toast.success('Histórico limpo!');
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'dinheiro': return 'Dinheiro';
      case 'cartao': return 'Cartão';
      default: return method;
    }
  };

  if (logs.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <FileText className="w-24 h-24 text-muted-foreground/30 mb-6" />
        <h2 className="text-2xl font-display text-muted-foreground mb-2">NENHUM REGISTRO</h2>
        <p className="text-muted-foreground">Os pedidos finalizados aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-display text-foreground">HISTÓRICO</h2>
          <span className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-sm">
            {logs.length} registro{logs.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={handleClearLogs}
          className="btn-danger flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Limpar Histórico
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Nº Pedido</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Data/Hora</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Cliente</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Pagamento</th>
                <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={`${log.orderNumber}-${index}`}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-display text-lg text-primary">
                      #{log.orderNumber}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{log.dateTime}</td>
                  <td className="p-4 text-foreground font-medium">{log.customerName}</td>
                  <td className="p-4">
                    <span className="text-sm bg-secondary px-2 py-1 rounded">
                      {formatPaymentMethod(log.paymentMethod)}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-foreground">
                    R$ {log.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total de Pedidos</p>
          <p className="text-2xl font-display text-foreground">{logs.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Faturamento Total</p>
          <p className="text-2xl font-display text-primary">
            R$ {logs.reduce((sum, log) => sum + log.total, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Ticket Médio</p>
          <p className="text-2xl font-display text-foreground">
            R$ {(logs.reduce((sum, log) => sum + log.total, 0) / logs.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
