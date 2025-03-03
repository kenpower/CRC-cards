import { supabase } from "./supabase";

const project_id = "0";

const reportSupabseError = ({ error, status, statusText }, operation) => {
  console.error("Error:", operation, error);
  console.error("Status:", status);
  console.error("Status Text:", statusText);
};

const DBinsertCard = async (card) => {
  const response = await supabase
    .from("cards")
    .insert({
      project_id: project_id,
      name: card.name,
      style: card.style,
    })
    .select("*");

  if (response.error) reportSupabseError(response, "insertCard");
  else {
    const record = response.data[0];
    console.log("Inserted record:", record);
    card.id = record.card_id;
  }
};

const DBfetchCRCProject = async () => {
  const response = await supabase
    .from("cards")
    .select("*")
    .eq("project_id", project_id);

  if (response.error) reportSupabseError(response, "fetchCRCProject");
  else {
    console.log("Fetched cards:", response.data);
    return response.data;
  }
};

const DBdeleteCard = async (cardId) => {
  const response = await supabase.from("cards").delete().eq("card_id", cardId);

  if (response.error) reportSupabseError(response, "deleteCard");
  else {
    console.log("Deleted card:", cardId);
    return true;
  }
};

const DBupdateCard = async (card) => {
  const response = await supabase
    .from("cards")
    .update({
      style: card.style,
      name: card.name,
      // collaborators: card.collaborators,
      // responsibilities: card.responsibilities,
    })
    .eq("card_id", card.id);

  if (response.error) reportSupabseError(response, "updateCard");
  else console.log("Updated card:", card.id);
};

class Card {
  style = $state({ position: { left: 0, top: 0 } });
  name = $state("");
  collaborators = $state([]);
  responsibilities = $state([]);
  id = $state(-1);

  constructor(name) {
    this.name = name;
  }

  static fromDBRecord(record) {
    var card = new Card(record.name);
    card.style = record.style;
    card.id = record.card_id;
    return card;
  }
}

class CRCProject {
  cards = $state([]);

  addCard(name, position) {
    var card = new Card(name);
    card.style.position.left = position.left;
    card.style.position.top = position.top;
    this.cards.push(card);
    DBinsertCard(card);

    console.log("Added card with style:", card.style);
    console.log("Added card with position:", card.style.position);
  }

  deleteCard(id) {
    console.log("Deleting card:", id);
    if (DBdeleteCard(id))
      this.cards = this.cards.filter((card) => card.id !== id);
  }

  updateCard(card) {
    DBupdateCard(card);
    console.log("Updated card:", card);
  }
}

const getProject = async (project_id) => {
  const cardsData = await DBfetchCRCProject();

  var project = $state(new CRCProject());
  project.cards = cardsData.map((record) => Card.fromDBRecord(record));

  return project;
};

export const crcProject = await getProject(project_id);
