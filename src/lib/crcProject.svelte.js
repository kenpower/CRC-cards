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
      style: { position: card.position },
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

class Card {
  position = $state({ left: 0, top: 0 });
  name = $state("");
  collaborators = $state([]);
  responsibilities = $state([]);
  id = $state(-1);

  constructor(name) {
    this.name = name;
  }

  static fromDBRecord(record) {
    var card = new Card(record.name);
    card.position = record.style.position;
    card.id = record.card_id;
    return card;
  }
}

class CRCProject {
  cards = $state([]);

  addCard(name, position) {
    var card = new Card(name);
    card.left = position.left;
    card.top = position.top;
    this.cards.push(card);
    DBinsertCard(card);
    console.log(this.cards);
  }

  deleteCard(id) {
    console.log("Deleting card:", id);
    if (DBdeleteCard(id))
      this.cards = this.cards.filter((card) => card.id !== id);
  }
}

const getProject = async (project_id) => {
  const cardsData = await DBfetchCRCProject();

  var project = $state(new CRCProject());
  project.cards = cardsData.map((record) => Card.fromDBRecord(record));

  return project;
};

export const crcProject = await getProject(project_id);
