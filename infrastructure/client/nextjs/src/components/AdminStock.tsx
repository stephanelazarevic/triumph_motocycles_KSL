"use client"
import React, { useState } from 'react';
import Bouton from "@/components/Button";
import DynamicForm from '@/components/DynamicFormAdmin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package, ShoppingCart, AlertTriangle, Search, PackagePlus, Pencil, Trash2 } from 'lucide-react';

interface SparePart {
  id: number;
  name: string;
  reference: string;
  currentStock: number;
  minStock: number;
  price: number;
  category: string;
}

interface Order {
  id: number;
  reference: string;
  date: string;
  items: string;
  cost: number;
  status: string;
  deliveryTime: string;
}

const SparePartsManagement = () => {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  // État pour le modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);

  // Données simulées pour les pièces
  const [spareParts, setSpareParts] = useState<SparePart[]>([
    {
      id: 1,
      name: 'Filtre à huile',
      reference: 'FH-2024',
      currentStock: 5,
      minStock: 10,
      price: 15.99,
      category: 'Filtres'
    },
    {
      id: 2,
      name: 'Plaquettes de frein',
      reference: 'PF-2024',
      currentStock: 2,
      minStock: 8,
      price: 45.99,
      category: 'Freinage'
    },
    {
      id: 3,
      name: 'Pneu avant',
      reference: 'PA-2024',
      currentStock: 12,
      minStock: 4,
      price: 89.99,
      category: 'Pneumatiques'
    }
  ]);

  const [orders] = useState<Order[]>([
    {
      id: 1,
      reference: 'CMD-001',
      date: '2024-02-08',
      items: 'Filtre à huile x5',
      cost: 79.95,
      status: 'Livrée',
      deliveryTime: '3 jours'
    },
    {
      id: 2,
      reference: 'CMD-002',
      date: '2024-02-09',
      items: 'Plaquettes de frein x4',
      cost: 183.96,
      status: 'En cours',
      deliveryTime: 'Estimé 5 jours'
    }
  ]);

  // Gestionnaires d'événements
  const handleAjout = () => {
    setSelectedPart(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const partToEdit = spareParts.find(part => part.id === id);
    if (partToEdit) {
      setSelectedPart(partToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setSpareParts(prevParts => prevParts.filter(part => part.id !== id));
  };

  // Gestionnaire de soumission du formulaire
  const handleFormSubmit = (formData: Partial<SparePart>) => {
    if (selectedPart) {
      // Mode édition
      setSpareParts(prevParts =>
        prevParts.map(part =>
          part.id === selectedPart.id ? { ...part, ...formData } : part
        )
      );
    } else {
      // Mode ajout
      const newPart = {
        id: Math.max(...spareParts.map(p => p.id)) + 1,
        name: formData.name || '',
        reference: formData.reference || '',
        currentStock: formData.currentStock || 0,
        minStock: formData.minStock || 0,
        price: formData.price || 0,
        category: formData.category || ''
      };
      setSpareParts(prevParts => [...prevParts, newPart]);
    }
    setIsFormOpen(false);
  };

  // Fonction de recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtrer les pièces avec stock bas
  const lowStockParts = spareParts.filter(part => part.currentStock < part.minStock);

  // Filtrer les pièces en fonction de la recherche
  const filteredParts = spareParts.filter(part =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Pièces Détachées</h1>

      <DynamicForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formType="sparePart"
        initialData={selectedPart || undefined}
        onSubmit={handleFormSubmit}
      />

      {lowStockParts.length > 0 && (
        <div className="space-y-3">
          {lowStockParts.map(part => (
            <Alert key={part.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Stock Critique</AlertTitle>
              <AlertDescription>
                {part.name} (Réf: {part.reference}) - Stock actuel: {part.currentStock}
                (Minimum requis: {part.minStock})
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Stock
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Commandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Inventaire des Pièces</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Rechercher une pièce..."
                      className="border-none outline-none bg-transparent"
                    />
                  </div>
                  <Bouton
                    text="Ajouter"
                    icon={<PackagePlus className="w-4 h-4" />}
                    variant="default"
                    onClick={handleAjout}
                    className="h-8 w-32 p-0"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.reference}</TableCell>
                      <TableCell>{part.name}</TableCell>
                      <TableCell>{part.category}</TableCell>
                      <TableCell>{part.currentStock}</TableCell>
                      <TableCell>{part.price} €</TableCell>
                      <TableCell>
                        <Badge
                          variant={part.currentStock < part.minStock ? 'destructive' : 'success'}
                        >
                          {part.currentStock < part.minStock ? 'Stock bas' : 'Stock OK'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Bouton
                            text="Éditer"
                            icon={<Pencil className="w-4 h-4" />}
                            variant="primary"
                            onClick={() => handleEdit(part.id)}
                            className="h-8 w-32 p-0"
                          />
                          <Bouton
                            text="Supprimer"
                            icon={<Trash2 className="w-4 h-4" />}
                            variant="danger"
                            onClick={() => handleDelete(part.id)}
                            className="h-8 w-32 p-0"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Coût total</TableHead>
                    <TableHead>Délai livraison</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.reference}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.cost} €</TableCell>
                      <TableCell>{order.deliveryTime}</TableCell>
                      <TableCell>
                        <Badge
                          variant={order.status === 'Livrée' ? 'success' : 'default'}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SparePartsManagement;
