import React from 'react';
import Link from 'next/link';
import { RotateCcw, Warehouse, Bell, FileText, Settings, ShoppingCart } from 'lucide-react';

const navigationCards = [
  {
    title: 'Gestion des essais',
    description: 'Gérer les essais',
    icon: RotateCcw,
    href: '/admin/essai',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Stock',
    description: 'Gérer les produits',
    icon: Warehouse,
    href: '/admin/stock',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Entretiens',
    description: 'Gérer les entretiens',
    icon: FileText,
    href: '/admin/entretien',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Notifications',
    description: 'Configuration des notifications',
    icon: Bell,
    href: '/admin/notification',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  }
];

const AdminDashboard = () => {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tableau de bord administrateur
          </h1>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Bienvenue
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="block"
              >
                <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                      <p className="text-sm text-gray-500">{card.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;