"use client"
import React, { useState } from 'react';
import Bouton from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  History,
  AlertTriangle,
  Search,
  Clock,
  ShieldCheck,
  BookmarkPlus,
  Pencil,
  Trash2
} from 'lucide-react';

const MaintenanceManagement = () => {
  // États de recherche pour chaque onglet
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [issuesSearch, setIssuesSearch] = useState('');

  // Données simulées pour les modèles de moto et leurs intervalles d'entretien
  const [bikeModels] = useState([
    {
      id: 1,
      name: 'Street Triple',
      maintenanceInterval: 10000,
      timeInterval: 12, // mois
      nextService: '2024-03-15',
      currentMileage: 9500
    },
    {
      id: 2,
      name: 'Tiger Sport 660',
      maintenanceInterval: 16000,
      timeInterval: 12,
      nextService: '2024-04-20',
      currentMileage: 14800
    }
  ]);

  // Données simulées pour les entretiens
  const [maintenances] = useState([
    {
      id: 1,
      bikeModel: 'Street Triple',
      date: '2024-02-01',
      type: 'Préventif',
      mileage: 9000,
      parts: ['Filtre à huile', 'Huile moteur'],
      cost: 250,
      technician: 'Jean Martin',
      notes: 'RAS - Entretien standard effectué'
    },
    {
      id: 2,
      bikeModel: 'Tiger Sport 660',
      date: '2024-02-05',
      type: 'Curatif',
      mileage: 14500,
      parts: ['Plaquettes de frein', 'Disque de frein'],
      cost: 450,
      technician: 'Marie Dubois',
      notes: 'Remplacement système de freinage suite à usure prématurée'
    }
  ]);

  // Données simulées pour les pannes et garanties
  const [issues] = useState([
    {
      id: 1,
      bikeModel: 'Street Triple',
      date: '2024-01-15',
      type: 'Panne',
      description: 'Problème de démarrage',
      status: 'Résolu',
      warranty: true,
      resolution: 'Remplacement du démarreur sous garantie',
      cost: 0
    },
    {
      id: 2,
      bikeModel: 'Tiger Sport 660',
      date: '2024-02-03',
      type: 'Garantie',
      description: 'Fuite d\'huile',
      status: 'En cours',
      warranty: true,
      resolution: 'En attente de pièces',
      cost: 0
    }
  ]);

  // Gestionnaires d'événements
  const handleAjout = () => {
    console.log("Ajout d'un nouveau modèle");
  };

  const handleEdit = (id: number) => {
    console.log("Édition du modèle:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Suppression du modèle:", id);
  };

  // Filtrer les données en fonction des recherches
  const filteredBikeModels = bikeModels.filter(bike =>
    bike.name.toLowerCase().includes(scheduleSearch.toLowerCase())
  );

  const filteredMaintenances = maintenances.filter(maintenance =>
    maintenance.bikeModel.toLowerCase().includes(historySearch.toLowerCase()) ||
    maintenance.type.toLowerCase().includes(historySearch.toLowerCase()) ||
    maintenance.technician.toLowerCase().includes(historySearch.toLowerCase()) ||
    maintenance.parts.some(part => part.toLowerCase().includes(historySearch.toLowerCase()))
  );

  const filteredIssues = issues.filter(issue =>
    issue.bikeModel.toLowerCase().includes(issuesSearch.toLowerCase()) ||
    issue.type.toLowerCase().includes(issuesSearch.toLowerCase()) ||
    issue.description.toLowerCase().includes(issuesSearch.toLowerCase()) ||
    issue.resolution.toLowerCase().includes(issuesSearch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Entretiens</h1>

      {/* Alertes pour les entretiens à venir */}
      <div className="space-y-3">
        {bikeModels.map(bike => {
          const isMaintenanceSoon = bike.currentMileage > bike.maintenanceInterval - 1000;
          if (isMaintenanceSoon) {
            return (
              <Alert key={bike.id} variant="warning">
                <Clock className="h-4 w-4" />
                <AlertTitle>Entretien Proche</AlertTitle>
                <AlertDescription>
                  {bike.name} - Prochain entretien prévu le {bike.nextService}
                  (Kilométrage actuel: {bike.currentMileage} km)
                </AlertDescription>
              </Alert>
            );
          }
          return null;
        })}
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Planification
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Pannes & Garanties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Planification des Entretiens</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="search"
                      value={scheduleSearch}
                      onChange={(e) => setScheduleSearch(e.target.value)}
                      placeholder="Rechercher un modèle..."
                      className="border-none outline-none bg-transparent"
                    />
                  </div>
                  <Bouton
                    text="Ajouter"
                    icon={<BookmarkPlus className="w-4 h-4" />}
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
                    <TableHead>Modèle</TableHead>
                    <TableHead>Intervalle (km)</TableHead>
                    <TableHead>Intervalle (mois)</TableHead>
                    <TableHead>Kilométrage actuel</TableHead>
                    <TableHead>Prochain entretien</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBikeModels.map((bike) => (
                    <TableRow key={bike.id}>
                      <TableCell>{bike.name}</TableCell>
                      <TableCell>{bike.maintenanceInterval} km</TableCell>
                      <TableCell>{bike.timeInterval} mois</TableCell>
                      <TableCell>{bike.currentMileage} km</TableCell>
                      <TableCell>{bike.nextService}</TableCell>
                      <TableCell>
                        <Badge
                          variant={bike.currentMileage > bike.maintenanceInterval - 1000 ? 'warning' : 'success'}
                        >
                          {bike.currentMileage > bike.maintenanceInterval - 1000 ? 'Proche' : 'OK'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Bouton
                            text="Éditer"
                            icon={<Pencil className="w-4 h-4" />}
                            variant="primary"
                            onClick={() => handleEdit(bike.id)}
                            className="h-8 w-32 p-0"
                          />
                          <Bouton
                            text="Supprimer"
                            icon={<Trash2 className="w-4 h-4" />}
                            variant="danger"
                            onClick={() => handleDelete(bike.id)}
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

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Historique des Entretiens</span>
                <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Rechercher un entretien..."
                    className="border-none outline-none bg-transparent"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Modèle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Kilométrage</TableHead>
                    <TableHead>Pièces changées</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead>Technicien</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenances.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell>{maintenance.date}</TableCell>
                      <TableCell>{maintenance.bikeModel}</TableCell>
                      <TableCell>
                        <Badge variant={maintenance.type === 'Préventif' ? 'default' : 'secondary'}>
                          {maintenance.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{maintenance.mileage} km</TableCell>
                      <TableCell>{maintenance.parts.join(', ')}</TableCell>
                      <TableCell>{maintenance.cost} €</TableCell>
                      <TableCell>{maintenance.technician}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Pannes et Garanties</span>
                <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={issuesSearch}
                    onChange={(e) => setIssuesSearch(e.target.value)}
                    placeholder="Rechercher une panne..."
                    className="border-none outline-none bg-transparent"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Modèle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Garantie</TableHead>
                    <TableHead>Résolution</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>{issue.date}</TableCell>
                      <TableCell>{issue.bikeModel}</TableCell>
                      <TableCell>{issue.type}</TableCell>
                      <TableCell>{issue.description}</TableCell>
                      <TableCell>
                        <Badge variant={issue.warranty ? 'success' : 'destructive'}>
                          {issue.warranty ? 'Oui' : 'Non'}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.resolution}</TableCell>
                      <TableCell>
                        <Badge
                          variant={issue.status === 'Résolu' ? 'success' : 'warning'}
                        >
                          {issue.status}
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

export default MaintenanceManagement;
