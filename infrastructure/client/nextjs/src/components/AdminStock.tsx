"use client"
import React, { useState } from 'react';
import Bouton from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package, ShoppingCart, AlertTriangle, Search, PackagePlus } from 'lucide-react';

const SparePartsManagement = () => {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');

  // Données simulées pour les pièces
  const [spareParts] = useState([
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

  const [orders] = useState([
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
    console.log("Ajout d'une nouvelle pièce");
  };

  const handleEdit = (id: number) => {
    console.log("Édition de la pièce:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Suppression de la pièce:", id);
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
                            icon={<AlertTriangle className="w-4 h-4" />}
                            variant="primary"
                            onClick={() => handleEdit(part.id)}
                            className="h-8 w-32 p-0"
                          />
                          <Bouton
                            text="Supprimer"
                            icon={<AlertTriangle className="w-4 h-4" />}
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
          {/* Le reste du code pour les commandes reste inchangé */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SparePartsManagement;
