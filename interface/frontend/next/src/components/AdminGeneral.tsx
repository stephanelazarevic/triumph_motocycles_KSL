"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Bike, Search, UserPlus,CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import Bouton from "@/components/Button";
import DynamicForm from '@/components/DynamicFormAdmin';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  status: string;
}

interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

// Données mockées pour les utilisateurs
const mockUsers: User[] = [
  {
    id: "usr-001",
    firstName: "Thomas",
    lastName: "Dupont",
    licenseNumber: "FR789456123",
    phoneNumber: "+33 6 12 34 56 78",
    email: "t.dupont@enterprise.com",
    status: "Actif",
  },
  {
    id: "usr-002",
    firstName: "Marie",
    lastName: "Laurent",
    licenseNumber: "FR456789123",
    phoneNumber: "+33 6 23 45 67 89",
    email: "m.laurent@enterprise.com",
    status: "Actif",
  },
  {
    id: "usr-003",
    firstName: "Lucas",
    lastName: "Martin",
    licenseNumber: "FR123789456",
    phoneNumber: "+33 6 34 56 78 90",
    email: "l.martin@enterprise.com",
    status: "Inactif",
  }
];

// Données mockées pour les motos
const mockMotorcycles: Motorcycle[] = [
  {
    id: "moto-001",
    brand: "Yamaha",
    model: "MT-07",
    year: 2023,
    licensePlate: "AB-123-CD",
    status: "Disponible",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15"
  },
  {
    id: "moto-002",
    brand: "Kawasaki",
    model: "Z650",
    year: 2023,
    licensePlate: "EF-456-GH",
    status: "En maintenance",
    lastMaintenance: "2024-02-01",
    nextMaintenance: "2024-05-01"
  },
  {
    id: "moto-003",
    brand: "Honda",
    model: "CB650R",
    year: 2022,
    licensePlate: "IJ-789-KL",
    status: "En location",
    lastMaintenance: "2024-01-30",
    nextMaintenance: "2024-04-30"
  }
];

const AdminUsersAndBikes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'user' | 'motorcycle'>('user');
  const [selectedItem, setSelectedItem] = useState<User | Motorcycle | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(mockMotorcycles);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAdd = (type: 'user' | 'motorcycle') => {
    setFormType(type);
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (type: 'user' | 'motorcycle', id: string) => {
    setFormType(type);
    const itemToEdit = type === 'user'
      ? users.find(user => user.id === id)
      : motorcycles.find(moto => moto.id === id);
    setSelectedItem(itemToEdit);
    setIsFormOpen(true);
  };

  const handleDelete = (type: 'user' | 'motorcycle', id: string) => {
    if (type === 'user') {
      setUsers(users.filter(user => user.id !== id));
      toast.success("Utilisateur supprimé avec succès");
    } else {
      setMotorcycles(motorcycles.filter(moto => moto.id !== id));
      toast.success("Moto supprimée avec succès");
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMotorcycles = motorcycles.filter(moto =>
    `${moto.brand} ${moto.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moto.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Utilisateurs et Motos</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="motorcycles" className="flex items-center gap-2">
            <Bike className="w-4 h-4" />
            Motos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Liste des Utilisateurs</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Rechercher un utilisateur..."
                      className="border-none outline-none bg-transparent"
                    />
                  </div>
                  <Bouton
                    text="Ajouter"
                    icon={<UserPlus className="w-4 h-4" />}
                    variant="default"
                    onClick={() => handleAdd('user')}
                    className="h-8 w-32 p-0"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Permis</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.licenseNumber}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Actif' ? 'success' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Bouton
                            text="Éditer"
                            icon={<Pencil className="w-4 h-4" />}
                            variant="primary"
                            onClick={() => handleEdit('user', user.id)}
                            className="h-8 w-32 p-0"
                          />
                          <Bouton
                            text="Supprimer"
                            icon={<Trash2 className="w-4 h-4" />}
                            variant="danger"
                            onClick={() => handleDelete('user', user.id)}
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

        <TabsContent value="motorcycles">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Liste des Motos</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Rechercher une moto..."
                      className="border-none outline-none bg-transparent"
                    />
                  </div>
                  <Bouton
                    text="Ajouter"
                    icon={<CirclePlus  className="w-4 h-4" />}
                    variant="default"
                    onClick={() => handleAdd('motorcycle')}
                    className="h-8 w-32 p-0"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marque/Modèle</TableHead>
                    <TableHead>Immatriculation</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Dernière maintenance</TableHead>
                    <TableHead>Prochaine maintenance</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMotorcycles.map((moto) => (
                    <TableRow key={moto.id}>
                      <TableCell>{moto.brand} {moto.model}</TableCell>
                      <TableCell>{moto.licensePlate}</TableCell>
                      <TableCell>{moto.year}</TableCell>
                      <TableCell>{new Date(moto.lastMaintenance).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{new Date(moto.nextMaintenance).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            moto.status === 'Disponible' ? 'success' :
                            moto.status === 'En maintenance' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {moto.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Bouton
                            text="Éditer"
                            icon={<Pencil className="w-4 h-4" />}
                            variant="primary"
                            onClick={() => handleEdit('motorcycle', moto.id)}
                            className="h-8 w-32 p-0"
                          />
                          <Bouton
                            text="Supprimer"
                            icon={<Trash2 className="w-4 h-4" />}
                            variant="danger"
                            onClick={() => handleDelete('motorcycle', moto.id)}
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
      </Tabs>
    </div>
  );
};

export default AdminUsersAndBikes;