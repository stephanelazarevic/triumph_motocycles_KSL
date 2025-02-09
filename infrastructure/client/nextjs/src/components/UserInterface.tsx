"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, LogIn, User } from "lucide-react";

const UserInterface = () => {
  const [date, setDate] = useState<Date>();
  const [selectedBike, setSelectedBike] = useState(null);

  // Données simulées pour les motos
  const bikes = [
    {
      id: 1,
      name: 'Street Triple RS',
      image: '/api/placeholder/400/300',
      description: 'Roadster sportif, 765cc, 123ch',
      availability: true
    },
    {
      id: 2,
      name: 'Tiger 900 Rally Pro',
      image: '/api/placeholder/400/300',
      description: 'Trail aventure, 888cc, 95ch',
      availability: true
    },
    {
      id: 3,
      name: 'Trident 660',
      image: '/api/placeholder/400/300',
      description: 'Roadster, 660cc, 81ch',
      availability: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec bouton login */}
      <header className="border-b bg-[#112434]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">KSL Triumph</h1>
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
        <h2 className="text-2xl font-bold mb-6">Nos motos disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <Card key={bike.id} className={cn(!bike.availability && "opacity-70")}>
              <img
                src={bike.image}
                alt={bike.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>{bike.name}</CardTitle>
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
      </section>

      {/* Formulaire de réservation */}
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Réserver un essai</CardTitle>
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
                  const selectedBike = bikes.find(bike => bike.id === parseInt(e.target.value));
                  setSelectedBike(selectedBike || null);
                }}
                value={selectedBike ? selectedBike.id.toString() : ''}
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
