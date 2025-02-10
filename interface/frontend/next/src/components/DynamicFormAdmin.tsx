import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Bouton from "@/components/Button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  // Pièces détachées
  name?: string;
  reference?: string;
  currentStock?: number;
  minStock?: number;
  price?: number;
  category?: string;

  // Maintenance
  maintenanceInterval?: number;
  timeInterval?: number;
  nextService?: string;
  currentMileage?: number;

  // Entretien
  date?: string;
  type?: string;
  mileage?: number;
  parts?: string[];
  cost?: number;
  technician?: string;
  notes?: string;

  // Essais
  driverId?: number;
  motoModel?: string;
  startDate?: string;
  duration?: string;
  status?: string;
  licenseNumber?: string;

  // Incidents
  description?: string;
  severity?: 'mineure' | 'moyenne' | 'majeure';
  resolution?: string;
  warranty?: boolean;
}

interface DynamicFormProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'sparePart' | 'maintenance' | 'service' | 'driver' | 'test' | 'incident';
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  isOpen,
  onClose,
  formType,
  initialData,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState<FormData>(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFormFields = () => {
    switch (formType) {
      case 'sparePart':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input
                    id="reference"
                    value={formData.reference || ''}
                    onChange={(e) => handleChange('reference', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Stock actuel</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock || ''}
                    onChange={(e) => handleChange('currentStock', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock minimum</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock || ''}
                    onChange={(e) => handleChange('minStock', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    onValueChange={(value) => handleChange('category', value)}
                    defaultValue={formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Filtres">Filtres</SelectItem>
                      <SelectItem value="Freinage">Freinage</SelectItem>
                      <SelectItem value="Pneumatiques">Pneumatiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        );

      case 'maintenance':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceInterval">Intervalle (km)</Label>
                  <Input
                    id="maintenanceInterval"
                    type="number"
                    value={formData.maintenanceInterval || ''}
                    onChange={(e) => handleChange('maintenanceInterval', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeInterval">Intervalle (mois)</Label>
                  <Input
                    id="timeInterval"
                    type="number"
                    value={formData.timeInterval || ''}
                    onChange={(e) => handleChange('timeInterval', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextService">Prochain entretien</Label>
                  <Input
                    id="nextService"
                    type="date"
                    value={formData.nextService || ''}
                    onChange={(e) => handleChange('nextService', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentMileage">Kilométrage actuel</Label>
                  <Input
                    id="currentMileage"
                    type="number"
                    value={formData.currentMileage || ''}
                    onChange={(e) => handleChange('currentMileage', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'driver':
        return (
          <>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du conducteur</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Numéro de permis</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  onValueChange={(value) => handleChange('status', value)}
                  defaultValue={formData.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case 'test':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motoModel">Modèle de moto</Label>
                  <Input
                    id="motoModel"
                    value={formData.motoModel || ''}
                    onChange={(e) => handleChange('motoModel', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    value={formData.duration || ''}
                    onChange={(e) => handleChange('duration', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    onValueChange={(value) => handleChange('status', value)}
                    defaultValue={formData.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="terminé">Terminé</SelectItem>
                      <SelectItem value="annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        );

      case 'incident':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    onValueChange={(value) => handleChange('type', value)}
                    defaultValue={formData.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accident">Accident</SelectItem>
                      <SelectItem value="Infraction">Infraction</SelectItem>
                      <SelectItem value="Panne">Panne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Gravité</Label>
                  <Select
                    onValueChange={(value) => handleChange('severity', value as 'mineure' | 'moyenne' | 'majeure')}
                    defaultValue={formData.severity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la gravité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mineure">Mineure</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="majeure">Majeure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolution">Résolution</Label>
                <Input
                  id="resolution"
                  value={formData.resolution || ''}
                  onChange={(e) => handleChange('resolution', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty">Garantie</Label>
                <Select
                  onValueChange={(value) => handleChange('warranty', value === 'true')}
                  defaultValue={formData.warranty?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sous garantie ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Oui</SelectItem>
                    <SelectItem value="false">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getFormTitle = () => {
    switch (formType) {
      case 'sparePart':
        return "Gérer une pièce";
      case 'maintenance':
        return "Gérer la maintenance";
      case 'driver':
        return "Gérer un conducteur";
      case 'test':
        return "Gérer un essai";
      case 'incident':
        return "Gérer un incident";
      default:
        return "Formulaire";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFormFields()}
          <div className="flex justify-end space-x-2">
            <Bouton
              text="Annuler"
              variant="outline"
              onClick={onClose}
              className="h-8 w-24"
            />
            <Bouton
              text="Enregistrer"
              variant="default"
              type="submit"
              className="h-8 w-24"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicForm;
