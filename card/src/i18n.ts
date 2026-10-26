// Card strings. Italian and English; anything else falls back to English.

import type { Mode } from "./types";

interface Strings {
  modes: Record<Mode, string>;
  directions: Record<string, string>;
  manualUntil: (time: string) => string;
  returnToSchedule: string;
  schedule: string;
  allOff: string;
  preheat: string;
  awaySetpoint: string;
  awayDelay: string;
  preheatRadius: string;
  addSlot: string;
  deleteSlot: string;
  confirmDelete: string;
  start: string;
  setpoint: string;
  current: string;
  target: string;
  noSlots: string;
  unavailable: string;
  full: string;
}

const EN: Strings = {
  modes: {
    home: "Home",
    away: "Away",
    preheat: "Preheat",
    manual: "Manual",
    paused: "Paused",
    off: "Off",
  },
  directions: {
    towards: "heading home",
    away_from: "moving away",
    stationary: "stationary",
    arrived: "arrived",
  },
  manualUntil: (time) => `Manual until ${time}`,
  returnToSchedule: "Return to schedule",
  schedule: "Schedule",
  allOff: "All off",
  preheat: "Preheat on the way home",
  awaySetpoint: "Away setpoint",
  awayDelay: "Away delay",
  preheatRadius: "Preheat radius",
  addSlot: "Add slot",
  deleteSlot: "Delete slot",
  confirmDelete: "Tap again to delete",
  start: "Start",
  setpoint: "Setpoint",
  current: "Now",
  target: "Target",
  noSlots: "No slots: add one with +",
  unavailable: "Schedule unavailable",
  full: "No free start time left",
};

const IT: Strings = {
  modes: {
    home: "In casa",
    away: "Fuori casa",
    preheat: "Preriscaldo",
    manual: "Manuale",
    paused: "Sospeso",
    off: "Spento",
  },
  directions: {
    towards: "sta tornando",
    away_from: "si allontana",
    stationary: "fermo",
    arrived: "arrivato",
  },
  manualUntil: (time) => `Manuale fino alle ${time}`,
  returnToSchedule: "Ritorna al programma",
  schedule: "Programma",
  allOff: "Spegni tutto",
  preheat: "Preriscaldo al rientro",
  awaySetpoint: "Temperatura fuori casa",
  awayDelay: "Ritardo fuori casa",
  preheatRadius: "Raggio preriscaldo",
  addSlot: "Aggiungi fascia",
  deleteSlot: "Elimina fascia",
  confirmDelete: "Tocca ancora per eliminare",
  start: "Inizio",
  setpoint: "Temperatura",
  current: "Ora",
  target: "Obiettivo",
  noSlots: "Nessuna fascia: aggiungine una con +",
  unavailable: "Programma non disponibile",
  full: "Nessun orario libero",
};

export function strings(language: string): Strings {
  return language.split("-")[0] === "it" ? IT : EN;
}
