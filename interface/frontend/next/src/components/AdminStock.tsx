"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Bouton from "@/components/Button";
import DynamicForm from '@/components/DynamicFormAdmin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package, ShoppingCart, AlertTriangle, Search, PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { toast } from "sonner";

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

const API_BASE_URL = 'http://localhost:8000/api';

// Données mockées pour les pièces détachées
const mockSpareParts = [
  {
    id: 1,
    name: "Filtre à huile",
    reference: "FH-2024",
    currentStock: 15,
    minStock: 10,
    price: 25.99,
    category: "Filtration"
  },
  {
    id: 2,
    name: "Plaquettes de frein",
    reference: "PF-1850",
    currentStock: 8,
    minStock: 12,
    price: 45.50,
    category: "Freinage"
  },
  {
    id: 3,
    name: "Batterie 12V",
    reference: "BAT-450",
    currentStock: 20,
    minStock: 5,
    price: 89.99,
    category: "Électrique"
  },
  {
    id: 4,
    name: "Amortisseur avant",
    reference: "AM-789",
    currentStock: 4,
    minStock: 6,
    price: 120.00,
    category: "Suspension"
  },
  {
    id: 5,
    name: "Courroie distribution",
    reference: "CD-456",
    currentStock: 10,
    minStock: 8,
    price: 35.75,
    category: "Moteur"
  }
];

const SparePartsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpareParts();
    fetchOrders();
  }, []);

  const fetchSpareParts = async () => {
    try {
      // Au lieu de faire l'appel API, on utilise les données mockées
      setSpareParts(mockSpareParts);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger la liste des pièces');
      setSpareParts([]);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/order`);
      console.log('Orders API Response:', response);

      // Récupérer la data qui est déjà une chaîne JSON
      const responseData = response.data;

      // Parser la première fois pour obtenir le tableau d'objets
      const ordersData = JSON.parse(responseData);
      console.log('Données parsées une fois:', ordersData);

      const transformedOrders = ordersData.map((order: any) => {
        // Parser le champ 'parts' qui est aussi une chaîne JSON
        const parsedParts = JSON.parse(order.parts);
        return {
          id: order.id,
          reference: order.id,
          date: new Date(order.orderDate).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          items: parsedParts.map((p: any) => `${p.name} (x${p.quantity})`).join(', '),
          cost: Number(order.totalAmount),
          status: order.status,
          deliveryTime: order.deliveryTime || 'N/A'
        };
      });

      console.log('Commandes transformées:', transformedOrders);
      setOrders(transformedOrders);

    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Impossible de charger la liste des commandes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id: number) => {
    try {
      // Simulation de la suppression avec les données mockées
      const updatedParts = spareParts.filter(part => part.id !== id);
      setSpareParts(updatedParts);
      toast.success("Pièce supprimée avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression de la pièce");
    }
  };

  const handleFormSubmit = async (formData: Partial<SparePart>) => {
    try {
      if (selectedPart) {
        // Simulation de la modification avec les données mockées
        const updatedParts = spareParts.map(part =>
          part.id === selectedPart.id ? { ...part, ...formData } : part
        );
        setSpareParts(updatedParts);
        toast.success("Pièce modifiée avec succès");
      } else {
        // Simulation de l'ajout avec les données mockées
        const newPart = {
          ...formData,
          id: Math.max(...spareParts.map(p => p.id)) + 1
        } as SparePart;
        setSpareParts([...spareParts, newPart]);
        toast.success("Pièce ajoutée avec succès");
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error("Erreur lors de l'enregistrement de la pièce");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const lowStockParts = spareParts.filter(part => part.currentStock < part.minStock);

  const filteredParts = spareParts.filter(part =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#112434]"></div>
      </div>
    );
  }

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