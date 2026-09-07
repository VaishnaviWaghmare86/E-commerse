import type { NotificationItem } from '../types';

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New order #ORD-1001',
    desc: 'Aarav Sharma placed an order for ₹1,499',
    time: '5m ago',
    type: 'order',
    link: '/admin/orders',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Low stock warning',
    desc: 'Teddy Bear (TED-001) has only 5 left in stock',
    time: '20m ago',
    type: 'stock',
    link: '/admin/inventory',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'System backup completed',
    desc: 'Daily cloud catalog sync succeeded',
    time: '2h ago',
    type: 'system',
    unread: false,
  },
];
