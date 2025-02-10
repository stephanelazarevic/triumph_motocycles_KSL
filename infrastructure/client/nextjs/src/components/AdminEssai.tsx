"use client";

import React, { useState, useEffect } from 'react';
import Bouton from "@/components/Button";
import DynamicForm from '@/components/DynamicFormAdmin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserCircle, AlertTriangle, Ticket, UserPlus, Pencil, Trash2 } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  status: string;
}

interface Test {
  id: number;
  driverId: number;
  motoModel: string;
  startDate: string;
  duration: string;
  status: string;
}

interface Incident {
  id: number;
  driverId: number;
  date: string;
  type: string;
  description: string;
  severity: 'mineure' | 'moyenne' | 'majeure';
}

const AdminDashboard = () => {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'driver' | 'test' | 'incident'>('driver');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      licenseNumber: '12345678',
      status: 'actif'
    },
    {
      id: 2,
      name: 'Marie Martin',
      licenseNumber: '87654321',
      status: 'inactif'
    }
  ]);

  const [tests, setTests] = useState([
    {
      id: 1,
      driverId: 1,
      motoModel: 'Honda CB650R',
      startDate: '2024-02-08',
      duration: '2 heures',
      status: 'terminé'
    },
    {
      id: 2,
      driverId: 2,
      motoModel: 'Yamaha MT-07',
      startDate: '2024-02-09',
      duration: '3 heures',
      status: 'en cours'
    }
  ]);

  const [incidents, setIncidents] = useState([
    {
      id: 1,
      driverId: 1,
      date: '2024-01-15',
      type: 'Infraction',
      description: 'Excès de vitesse',
      severity: 'mineure'
    },
    {
      id: 2,
      driverId: 2,
      date: '2024-02-01',
      type: 'Accident',
      description: 'Accrochage sans gravité',
      severity: 'moyenne'
    }
  ]);

  // États pour la gestion de l'interface
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Simuler un chargement initial
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Gestionnaires d'événements mis à jour pour les conducteurs
  const handleAjoutConducteur = () => {
    setFormType('driver');
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditConducteur = (id: number) => {
    const driverToEdit = drivers.find(driver => driver.id === id);
    setFormType('driver');
    setSelectedItem(driverToEdit);
    setIsFormOpen(true);
  };

  // Gestionnaires d'événements pour les essais
  const handleAjoutEssai = () => {
    setFormType('test');
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditEssai = (id: number) => {
    const testToEdit = tests.find(test => test.id === id);
    setFormType('test');
    setSelectedItem(testToEdit);
    setIsFormOpen(true);
  };

  // Gestionnaires d'événements pour les incidents
  const handleAjoutIncident = () => {
    setFormType('incident');
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditIncident = (id: number) => {
    const incidentToEdit = incidents.find(incident => incident.id === id);
    setFormType('incident');
    setSelectedItem(incidentToEdit);
    setIsFormOpen(true);
  };

  // Gestionnaire de soumission du formulaire
  const handleFormSubmit = (formData: any) => {
    switch (formType) {
      case 'driver':
        if (selectedItem) {
          setDrivers(prevDrivers =>
            prevDrivers.map(driver =>
              driver.id === selectedItem.id ? { ...driver, ...formData } : driver
            )
          );
        } else {
          setDrivers(prevDrivers => [
            ...prevDrivers,
            {
              id: Math.max(...prevDrivers.map(d => d.id)) + 1,
              ...formData
            }
          ]);
        }
        break;

      case 'test':
        if (selectedItem) {
          setTests(prevTests =>
            prevTests.map(test =>
              test.id === selectedItem.id ? { ...test, ...formData } : test
            )
          );
        } else {
          setTests(prevTests => [
            ...prevTests,
            {
              id: Math.max(...prevTests.map(t => t.id)) + 1,
              ...formData
            }
          ]);
        }
        break;

      case 'incident':
        if (selectedItem) {
          setIncidents(prevIncidents =>
            prevIncidents.map(incident =>
              incident.id === selectedItem.id ? { ...incident, ...formData } : incident
            )
          );
        } else {
          setIncidents(prevIncidents => [
            ...prevIncidents,
            {
              id: Math.max(...prevIncidents.map(i => i.id)) + 1,
              ...formData
            }
          ]);
        }
        break;
    }
    setIsFormOpen(false);
  };

  // Gestionnaires de suppression
  const handleDeleteConducteur = (id: number) => {
    setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== id));
  };

  const handleDeleteEssai = (id: number) => {
    setTests(prevTests => prevTests.filter(test => test.id !== id));
  };

  const handleDeleteIncident = (id: number) => {
    setIncidents(prevIncidents => prevIncidents.filter(incident => incident.id !== id));
  };

  const handleSearch = () => {
    console.log("Recherche:", searchQuery);
    // Filtrer les conducteurs en fonction de searchQuery
  };

  // Filtrer les conducteurs en fonction de la recherche
  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNumber.includes(searchQuery)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Essais Moto</h1>

      <DynamicForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formType={formType}
        initialData={selectedItem}
        onSubmit={handleFormSubmit}
      />

      <Tabs defaultValue="drivers" className="w-full">
        <TabsList>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Conducteurs
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Essais
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Incidents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Liste des Conducteurs</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un conducteur..."
                      className="border-none outline-none bg-transparent"
                    />
                  </div>
                  <Bouton
                    text="Ajouter"
                    icon={<UserPlus className="w-4 h-4" />}
                    variant="default"
                    onClick={handleAjoutConducteur}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Chargement...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>N° Permis</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>
                          <Badge variant={driver.status === 'actif' ? 'success' : 'secondary'}>
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Bouton
                              text="Éditer"
                              icon={<Pencil className="w-4 h-4" />}
                              variant="primary"
                              onClick={() => handleEditConducteur(driver.id)}
                              className="h-8 w-32 p-0"
                            />
                            <Bouton
                              text="Supprimer"
                              icon={<Trash2 className="w-4 h-4" />}
                              variant="danger"
                              onClick={() => handleDeleteConducteur(driver.id)}
                              className="h-8 w-32 p-0"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Essais Moto</span>
                <Bouton
                  text="Nouvel essai"
                  icon={<Ticket className="w-4 h-4" />}
                  variant="default"
                  onClick={handleAjoutEssai}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Chargement...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conducteur ID</TableHead>
                      <TableHead>Modèle</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>{test.driverId}</TableCell>
                        <TableCell>{test.motoModel}</TableCell>
                        <TableCell>{test.startDate}</TableCell>
                        <TableCell>{test.duration}</TableCell>
                        <TableCell>
                          <Badge variant={test.status === 'terminé' ? 'success' : 'default'}>
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Bouton
                              text="Éditer"
                              icon={<Pencil className="w-4 h-4" />}
                              variant="primary"
                              onClick={() => handleEditEssai(test.id)}
                              className="h-8 w-32 p-0"
                            />
                            <Bouton
                              text="Supprimer"
                              icon={<Trash2 className="w-4 h-4" />}
                              variant="danger"
                              onClick={() => handleDeleteEssai(test.id)}
                              className="h-8 w-32 p-0"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Historique des Incidents</span>
                <Bouton
                  text="Nouvel incident"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  variant="default"
                  onClick={handleAjoutIncident}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Chargement...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Moto ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Gravité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.driverId}</TableCell>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>{incident.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              incident.severity === 'mineure' ? 'success' :
                              incident.severity === 'moyenne' ? 'warning' : 'destructive'
                            }
                          >
                            {incident.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Bouton
                              text="Éditer"
                              icon={<Pencil className="w-4 h-4" />}
                              variant="primary"
                              onClick={() => handleEditIncident(incident.id)}
                              className="h-8 w-32 p-0"
                            />
                            <Bouton
                              text="Supprimer"
                              icon={<Trash2 className="w-4 h-4" />}
                              variant="danger"
                              onClick={() => handleDeleteIncident(incident.id)}
                              className="h-8 w-32 p-0"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
