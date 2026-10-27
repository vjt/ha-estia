// Card strings. Italian and English; anything else falls back to English.

import type { Mode } from "./types";

interface Strings {
  modes: Record<Mode, string>;
  directions: Record<string, string>;
  travellerHome: (name: string) => string;
  travellerAway: (name: string, distance: string, direction: string) => string;
  travellerUnknown: (name: string) => string;
  manualUntil: (time: string) => string;
  returnToSchedule: string;
  schedule: string;
  allOff: string;
  pausedInfo: string;
  offInfo: string;
  scheduled: string;
  boost: string;
  boostUntil: (time: string) => string;
  settings: string;
  edit: string;
  done: string;
  awaySummary: (setpoint: string, minutes: string) => string;
  preheatSummary: (km: string) => string;
  preheatOff: string;
  history: string;
  roomTemperature: string;
  targetTemperature: string;
  heatingEstimate: string;
  periods: { hours: number; label: string }[];
  preheat: string;
  awaySetpoint: string;
  awayDelay: string;
  preheatRadius: string;
  addSlot: string;
  deleteSlot: string;
  confirmDelete: string;
  start: string;
  setpoint: string;
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
    boost: "Boost",
    paused: "Manual (no expiry)",
    off: "Off",
  },
  directions: {
    towards: "heading home",
    away_from: "moving away",
    stationary: "not moving",
    arrived: "arrived",
  },
  travellerHome: (name) => `${name} is home`,
  travellerAway: (name, distance, direction) => `${name} is ${distance} away, ${direction}`,
  travellerUnknown: (name) => `${name}: position unknown`,
  manualUntil: (time) => `Manual until ${time}`,
  returnToSchedule: "Return to schedule",
  schedule: "Schedule",
  allOff: "All off",
  pausedInfo:
    "Schedule off: Estia leaves the thermostat alone and keeps the temperature you set, with no end. Slots, away and preheat are ignored until you choose Scheduled again.",
  offInfo: "Heating off: the thermostat is off and Estia does not touch it.",
  scheduled: "Scheduled",
  boost: "Boost",
  boostUntil: (time) => `Boost: maximum until ${time}, then back to before`,
  settings: "Schedule",
  edit: "Edit",
  done: "Done",
  awaySummary: (setpoint, minutes) => `Away: ${setpoint} °C after ${minutes} min with nobody home`,
  preheatSummary: (km) => `Preheat: within ${km} km when someone is heading home`,
  preheatOff: "Preheat off",
  history: "Temperature",
  roomTemperature: "Room",
  targetTemperature: "Target",
  heatingEstimate: "Heating (estimated)",
  periods: [
    { hours: 24, label: "24 hours" },
    { hours: 168, label: "7 days" },
    { hours: 720, label: "30 days" },
  ],
  preheat: "Preheat on the way home",
  awaySetpoint: "Away setpoint",
  awayDelay: "Away delay",
  preheatRadius: "Preheat radius",
  addSlot: "Add slot",
  deleteSlot: "Delete slot",
  confirmDelete: "Tap again to delete",
  start: "Start",
  setpoint: "Setpoint",
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
    boost: "Massimo",
    paused: "Manuale (senza scadenza)",
    off: "Spento",
  },
  directions: {
    towards: "sta tornando",
    away_from: "si allontana",
    stationary: "non si muove",
    arrived: "arrivato",
  },
  travellerHome: (name) => `${name} è a casa`,
  travellerAway: (name, distance, direction) => `${name} è a ${distance}, ${direction}`,
  travellerUnknown: (name) => `${name}: posizione sconosciuta`,
  manualUntil: (time) => `Manuale fino alle ${time}`,
  returnToSchedule: "Ritorna al programma",
  schedule: "Programma",
  allOff: "Spegni tutto",
  pausedInfo:
    "Programma spento: Estia non tocca il termostato e tiene la temperatura che hai impostato, senza scadenza. Fasce, fuori casa e preriscaldo sono ignorati finché non scegli di nuovo Pianificato.",
  offInfo: "Riscaldamento spento: il termostato è spento ed Estia non lo tocca.",
  scheduled: "Pianificato",
  boost: "Massimo",
  boostUntil: (time) => `Massimo fino alle ${time}, poi torna com'era`,
  settings: "Programma",
  edit: "Modifica",
  done: "Fatto",
  awaySummary: (setpoint, minutes) => `Fuori casa: ${setpoint} °C dopo ${minutes} min senza nessuno`,
  preheatSummary: (km) => `Preriscaldo: entro ${km} km se qualcuno sta tornando`,
  preheatOff: "Preriscaldo spento",
  history: "Temperatura",
  roomTemperature: "Ambiente",
  targetTemperature: "Obiettivo",
  heatingEstimate: "Riscaldamento (stima)",
  periods: [
    { hours: 24, label: "24 ore" },
    { hours: 168, label: "7 giorni" },
    { hours: 720, label: "30 giorni" },
  ],
  preheat: "Preriscaldo al rientro",
  awaySetpoint: "Temperatura fuori casa",
  awayDelay: "Ritardo fuori casa",
  preheatRadius: "Raggio preriscaldo",
  addSlot: "Aggiungi fascia",
  deleteSlot: "Elimina fascia",
  confirmDelete: "Tocca ancora per eliminare",
  start: "Inizio",
  setpoint: "Temperatura",
  noSlots: "Nessuna fascia: aggiungine una con +",
  unavailable: "Programma non disponibile",
  full: "Nessun orario libero",
};

export function strings(language: string): Strings {
  return language.split("-")[0] === "it" ? IT : EN;
}
