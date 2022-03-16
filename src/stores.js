import { writable } from "svelte/store";

const storedCards = localStorage.getItem("crcCards")
  ? JSON.parse(localStorage.getItem("crcCards"))
  : [];

export const crcCards = writable(storedCards);

// Anytime the store changes, update the local storage value
crcCards.subscribe(
  (cardsToStore) => (localStorage.crcCards = JSON.stringify(cardsToStore))
);
