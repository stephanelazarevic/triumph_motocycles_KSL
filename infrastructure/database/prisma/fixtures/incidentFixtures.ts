import { prisma } from "../seed.ts";
import { IncidentType } from "../../../../domain/enum/IncidentEnum.ts";

export const loadIncidentFixtures = async (motorcycleId: string) => {
  const incident1 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Panne moteur sur autoroute",
      type: IncidentType.BREAKDOWN,
      reportDate: new Date("2024-01-10T08:30:00Z"),
      resolutionDate: new Date("2024-01-10T14:00:00Z"),
      status: "resolved",
    },
  });

  const incident2 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Collision avec une voiture à un carrefour",
      type: IncidentType.ACCIDENT,
      reportDate: new Date("2024-02-05T15:20:00Z"),
      resolutionDate: null,
      status: "PENDING",
    },
  });

  const incident3 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Moteur refuse de démarrer",
      type: IncidentType.BREAKDOWN,
      reportDate: new Date("2024-03-15T07:45:00Z"),
      resolutionDate: new Date("2024-03-15T10:30:00Z"),
      status: "RESOLVED",
    },
  });

  const incident4 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Chute en virage serré",
      type: IncidentType.ACCIDENT,
      reportDate: new Date("2024-04-22T12:00:00Z"),
      resolutionDate: null,
      status: "IN_PROGRESS",
    },
  });

  const incident5 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Panne électrique soudaine",
      type: IncidentType.BREAKDOWN,
      reportDate: new Date("2024-05-02T18:10:00Z"),
      resolutionDate: null,
      status: "PENDING",
    },
  });

  const incident6 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Glissade sur route mouillée, dégâts légers",
      type: IncidentType.ACCIDENT,
      reportDate: new Date("2024-06-14T09:30:00Z"),
      resolutionDate: new Date("2024-06-15T16:00:00Z"),
      status: "RESOLVED",
    },
  });

  const incident7 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Perte de puissance moteur",
      type: IncidentType.BREAKDOWN,
      reportDate: new Date("2024-07-08T14:25:00Z"),
      resolutionDate: null,
      status: "IN_PROGRESS",
    },
  });

  const incident8 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Freins défectueux en descente",
      type: IncidentType.BREAKDOWN,
      reportDate: new Date("2024-08-19T11:40:00Z"),
      resolutionDate: new Date("2024-08-19T13:20:00Z"),
      status: "RESOLVED",
    },
  });

  const incident9 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Accident avec un cycliste",
      type: IncidentType.ACCIDENT,
      reportDate: new Date("2024-09-25T17:50:00Z"),
      resolutionDate: null,
      status: "PENDING",
    },
  });

  const incident10 = await prisma.incident.create({
    data: {
      motorcycleId: motorcycleId,
      description: "Moteur cale après long trajet",
      type: IncidentType.BREAKDOWN,
      reportDate: new Date("2024-10-30T20:15:00Z"),
      resolutionDate: new Date("2024-10-31T09:00:00Z"),
      status: "RESOLVED",
    },
  });

  return {
    incident1Id: incident1.id,
    incident2Id: incident2.id,
    incident3Id: incident3.id,
    incident4Id: incident4.id,
    incident5Id: incident5.id,
    incident6Id: incident6.id,
    incident7Id: incident7.id,
    incident8Id: incident8.id,
    incident9Id: incident9.id,
    incident10Id: incident10.id,
  };
};
