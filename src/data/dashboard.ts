export interface StatMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  iconName: 'DollarSign' | 'ShoppingCart' | 'Users' | 'Package';
  color: string;
}

export const initialStats: StatMetric[] = [
  {
    title: 'Total Sales',
    value: '₹8,644',
    change: '+12.5%',
    isPositive: true,
    timeframe: 'vs last month',
    iconName: 'DollarSign',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    title: 'Total Orders',
    value: '6',
    change: '+8.2%',
    isPositive: true,
    timeframe: 'vs last month',
    iconName: 'ShoppingCart',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    title: 'Total Customers',
    value: '7',
    change: '+15.4%',
    isPositive: true,
    timeframe: 'vs last month',
    iconName: 'Users',
    color: 'text-pink-500 bg-pink-50 border-pink-100',
  },
  {
    title: 'Total Products',
    value: '5',
    change: '+5.6%',
    isPositive: true,
    timeframe: 'vs last month',
    iconName: 'Package',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
];

export const revenueData = {
  today: [
    { label: '9 AM', amount: 350, orders: 1 },
    { label: '11 AM', amount: 1058, orders: 1 },
    { label: '1 PM', amount: 1499, orders: 1 },
    { label: '4 PM', amount: 2050, orders: 2 },
    { label: '6 PM', amount: 2557, orders: 2 },
    { label: '9 PM', amount: 2557, orders: 2 },
  ],
  weekly: [
    { label: 'Mon', amount: 1420, orders: 28 },
    { label: 'Tue', amount: 1850, orders: 35 },
    { label: 'Wed', amount: 1620, orders: 31 },
    { label: 'Thu', amount: 2100, orders: 42 },
    { label: 'Fri', amount: 2450, orders: 48 },
    { label: 'Sat', amount: 2980, orders: 58 },
    { label: 'Sun', amount: 2630, orders: 52 },
  ],
  monthly: [
    { label: 'Jan', amount: 8000, orders: 154 },
    { label: 'Feb', amount: 9500, orders: 180 },
    { label: 'Mar', amount: 11200, orders: 210 },
    { label: 'Apr', amount: 10400, orders: 195 },
    { label: 'May', amount: 12450, orders: 245 },
    { label: 'Jun', amount: 13100, orders: 260 },
  ],
  yearly: [
    { label: '2022', amount: 68000, orders: 1350 },
    { label: '2023', amount: 94000, orders: 1890 },
    { label: '2024', amount: 118000, orders: 2420 },
    { label: '2025', amount: 142000, orders: 2980 },
    { label: '2026', amount: 168000, orders: 3540 },
  ],
};

export interface ActivityItem {
  id: string;
  type: 'order' | 'product' | 'customer' | 'system';
  title: string;
  time: string;
  description: string;
}

export const recentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'order',
    title: 'New order #ORD-1001',
    time: '5 minutes ago',
    description: 'Aarav Sharma purchased Remote Control Car (₹1,499)',
  },
  {
    id: 'act-2',
    type: 'product',
    title: 'Product "Teddy Bear" updated',
    time: '20 minutes ago',
    description: 'Stock updated to 5 units (Low stock alert triggered)',
  },
  {
    id: 'act-3',
    type: 'customer',
    title: 'New customer registered',
    time: '1 hour ago',
    description: 'Priya Patel joined KidsPlay rewards',
  },
  {
    id: 'act-4',
    type: 'product',
    title: 'New product added',
    time: '2 hours ago',
    description: 'Montessori Wooden Balance Board added to Catalog',
  },
  {
    id: 'act-5',
    type: 'order',
    title: 'Order #ORD-1000 shipped',
    time: '3 hours ago',
    description: 'Dispatched via Express Courier with tracking #EX-9921',
  },
];
