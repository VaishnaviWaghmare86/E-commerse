import { ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  timeframe?: string;
  iconName: 'DollarSign' | 'ShoppingCart' | 'Users' | 'Package';
  color?: string;
}

const RupeeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="m6 13 8.5 8" />
    <path d="M6 13h3" />
    <path d="M9 13c6.667 0 6.667-10 0-10" />
  </svg>
);

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  timeframe = 'vs last month',
  iconName,
}) => {
  const iconMap = {
    DollarSign: <RupeeIcon className="w-5 h-5 text-emerald-600" />,
    ShoppingCart: <ShoppingCart className="w-5 h-5 text-blue-600" />,
    Users: <Users className="w-5 h-5 text-violet-600" />,
    Package: <Package className="w-5 h-5 text-amber-600" />,
  };

  const bgMap = {
    DollarSign: 'bg-emerald-50 border-emerald-100',
    ShoppingCart: 'bg-blue-50 border-blue-100',
    Users: 'bg-violet-50 border-violet-100',
    Package: 'bg-amber-50 border-amber-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 hover:shadow-sm hover:border-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bgMap[iconName]}`}>
          {iconMap[iconName]}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h2>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
              isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
          <span className="text-slate-400 font-medium">{timeframe}</span>
        </div>
      </div>
    </div>
  );
};
