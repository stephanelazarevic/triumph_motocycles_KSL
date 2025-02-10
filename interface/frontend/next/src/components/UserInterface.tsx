"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, LogIn, Bike } from "lucide-react";
import { toast } from 'sonner';

interface Motorcycle {
  id: string;
  name: string;
  image: string;
  description: string;
  availability: boolean;
}

const UserInterface = () => {
  const [date, setDate] = useState<Date>();
  const [selectedBike, setSelectedBike] = useState<Motorcycle | null>(null);
  const [bikes, setBikes] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/motorcycle');

      // Debug logs
      console.log('API Response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);

      // Ensure we have an array to work with
      let motorcycleArray = [];

      // Parse the response if it's a string
      if (typeof response.data === 'string') {
        try {
          motorcycleArray = JSON.parse(response.data);
        } catch (parseError) {
          console.error('Error parsing response data:', parseError);
          throw new Error('Invalid data format');
        }
      } else if (Array.isArray(response.data)) {
        motorcycleArray = response.data;
      } else if (response.data && typeof response.data === 'object') {
        motorcycleArray = Array.isArray(response.data.data) ? response.data.data : [];
      }

      if (!Array.isArray(motorcycleArray)) {
        console.error('Data is not an array:', motorcycleArray);
        throw new Error('Invalid data format');
      }

      const transformedData: Motorcycle[] = motorcycleArray.map((item: any) => ({
        id: item.id,
        name: `${item.brand?.value || 'Unknown'} ${item.model?.value || 'Model'} (${item.year || 'N/A'})`,
        image: '/api/placeholder/400/300',
        description: `Immatriculation: ${item.registrationNumber || 'N/A'}`,
        availability: item.status === 'available'
      }));

      console.log('Transformed data:', transformedData);
      setBikes(transformedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des motos:', error);
      toast.error('Impossible de charger la liste des motos');
      setBikes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec bouton login */}
      <header className="border-b bg-[#112434]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-white" />
            <h1 className="text-2xl text-white font-bold">KSL Triumph</h1>
          </div>
          <Link href="http://localhost:8080/login">
            <Button variant="outline" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Connexion
            </Button>
          </Link>
        </div>
      </header>

      {/* Section des motos disponibles */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Bike className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Nos motos disponibles</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#112434]"></div>
          </div>
        ) : bikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <Card key={bike.id} className={cn(!bike.availability && "opacity-70")}>
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bike className="h-5 w-5" />
                    <CardTitle>{bike.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{bike.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#112434]"
                    disabled={!bike.availability}
                    onClick={() => setSelectedBike(bike)}
                  >
                    {bike.availability ? "Réserver un essai" : "Indisponible"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Aucune moto disponible pour le moment
          </div>
        )}
      </section>

      {/* Formulaire de réservation */}
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5" />
              <CardTitle>Réserver un essai</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
            </div>

            <div className="space-y-2">
              <Label>Date souhaitée</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bike">Moto sélectionnée</Label>
              <select
                id="bike"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-[#5A8EA4] focus:outline-none"
                onChange={(e) => {
                  const selectedBike = bikes.find(bike => bike.id === e.target.value);
                  setSelectedBike(selectedBike || null);
                }}
                value={selectedBike ? selectedBike.id : ''}
              >
                <option value="" disabled className="text-muted-foreground">
                  Sélectionnez une moto
                </option>
                {bikes.map((bike) => (
                  <option
                    key={bike.id}
                    value={bike.id}
                    disabled={!bike.availability}
                    className={bike.availability ? "" : "text-muted-foreground"}
                  >
                    {bike.name} - {bike.availability ? "Disponible" : "Indisponible"}
                  </option>
                ))}
              </select>
            </div>

            <Button className="w-full bg-[#112434]">
              Réserver mon essai
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default UserInterface;