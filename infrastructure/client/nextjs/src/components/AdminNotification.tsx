"use client";

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Bouton from "@/components/Button";
import {
  Bell,
  Search,
  Send,
  History,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'maintenance' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  recipients: string[];
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
}

const NotificationManagement = () => {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');

  // État pour le formulaire d'envoi
  const [newNotification, setNewNotification] = useState({
    type: '',
    title: '',
    message: '',
    recipients: [] as string[]
  });

  // État pour les notifications envoyées
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'maintenance',
      title: 'Rappel d\'entretien',
      message: 'Votre moto nécessite un entretien dans les prochains jours.',
      recipients: ['client1@email.com', 'client2@email.com'],
      sentAt: '2024-02-10 10:30',
      status: 'sent'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Rappel de pièce',
      message: 'Une pièce de votre modèle fait l\'objet d\'un rappel.',
      recipients: ['client3@email.com'],
      sentAt: '2024-02-09 15:45',
      status: 'sent'
    }
  ]);

  // Données simulées des modèles de notification
  const notificationTemplates = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Rappel d\'entretien',
      message: 'Cher client, nous vous rappelons que votre moto [MODELE] nécessite un entretien.'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Rappel de rendez-vous',
      message: 'Votre rendez-vous est confirmé pour le [DATE] à [HEURE].'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Alerte de sécurité',
      message: 'Une alerte de sécurité importante concerne votre moto [MODELE].'
    }
  ];

  // Gestionnaire d'envoi de notification
  const handleSendNotification = () => {
    const newNotif: Notification = {
      id: notifications.length + 1,
      type: newNotification.type as 'maintenance' | 'reminder' | 'alert' | 'info',
      title: newNotification.title,
      message: newNotification.message,
      recipients: newNotification.recipients,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    setNotifications([newNotif, ...notifications]);
    setNewNotification({
      type: '',
      title: '',
      message: '',
      recipients: []
    });
  };

  // Filtre des notifications
  const filteredNotifications = notifications.filter(notif =>
    notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notif.recipients.some(recipient => recipient.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Fonction pour obtenir la couleur de la badge selon le type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'default';
      case 'reminder':
        return 'secondary';
      case 'alert':
        return 'destructive';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Notifications</h1>

      <Tabs defaultValue="send" className="w-full">
        <TabsList>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Envoyer
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Envoyer une Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de notification</label>
                  <Select onValueChange={(value) => setNewNotification({
                    ...newNotification,
                    type: value
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="reminder">Rappel</SelectItem>
                      <SelectItem value="alert">Alerte</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Modèle de message</label>
                  <Select onValueChange={(value) => {
                    const template = notificationTemplates.find(t => t.id.toString() === value);
                    if (template) {
                      setNewNotification({
                        ...newNotification,
                        type: template.type,
                        title: template.title,
                        message: template.message
                      });
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({
                    ...newNotification,
                    title: e.target.value
                  })}
                  placeholder="Entrez le titre de la notification"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({
                    ...newNotification,
                    message: e.target.value
                  })}
                  placeholder="Entrez le message de la notification"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destinataires</label>
                <Select onValueChange={(value) => setNewNotification({
                  ...newNotification,
                  recipients: [...newNotification.recipients, value]
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les destinataires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    <SelectItem value="maintenance">Clients avec maintenance proche</SelectItem>
                    <SelectItem value="recent">Clients récents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Bouton
                  text="Envoyer la notification"
                  icon={<Send className="w-4 h-4" />}
                  variant="default"
                  onClick={handleSendNotification}
                  className="w-auto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Historique des Notifications</span>
                <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher dans l'historique..."
                    className="border-none outline-none bg-transparent"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date d'envoi</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>{notification.sentAt}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(notification.type)}>
                          {notification.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{notification.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {notification.message}
                      </TableCell>
                      <TableCell>{notification.recipients.join(', ')}</TableCell>
                      <TableCell>
                        <Badge variant={notification.status === 'sent' ? 'success' : 'destructive'}>
                          {notification.status}
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

export default NotificationManagement;
