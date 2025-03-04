import { supabase } from "./supabase";

const project_id = "0";

function getTempInt4() {
  return Math.floor(Math.random() * 2_000_000_000); // Avoids the max int4 limit
}

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
    card.id = record.id;
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

const DBfetchCRCProjectCards = async (project_id) => {
  const response = await supabase
    .from("cards")
    .select(
      `
      *,
      collaborators (
        id,
        name,
        display_order
      ),
      responsibilities (
        id,
        name,
        display_order
      )
    `
    )
    .eq("project_id", project_id);

  if (response.error) {
    reportSupabseError(response, "fetchCRCProjectCards");
    return null;
  } else {
    console.log("Fetched cards with relationships:", response.data);
    return response.data.map((record) => Card.fromDBRecord(record));
  }
};

const DBdeleteCard = async (cardId) => {
  const response = await supabase.from("cards").delete().eq("id", cardId);

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
    })
    .eq("id", card.id);

  if (response.error) reportSupabseError(response, "updateCard");
  else console.log("Updated card:", card.id);
};

const DBaddResponsibility = async (responsibility) => {
  const response = await supabase
    .from("responsibilities")
    .insert(responsibility)
    .select("*");

  if (response.error) reportSupabseError(response, "addResponsibility");
  else {
    const record = response.data[0];
    console.log("Inserted responsibility:", record);
    return record;
  }
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
    card.style = record.style || { position: { left: 0, top: 0 } };
    card.id = record.id;
    card.collaborators = record.collaborators.map((collab) => ({
      id: collab.id,
      name: collab.name,
      display_order: collab.display_order,
    }));
    card.responsibilities = record.responsibilities.map((resp) => ({
      id: resp.id,
      name: resp.name,
      display_order: resp.display_order,
    }));
    return card;
  }

  update() {
    DBupdateCard(this);
    console.log("Updated card:", this);
  }

  addResponsibility = async (name) => {
    // Arrow function ensures `this` stays bound
    console.log("Adding responsibility in card:", this);
    const responsibility = {
      name: name,
      display_order: 0,
      card_id: this.id,
    };

    const newResponsibility = await DBaddResponsibility(responsibility);
    console.log("Added responsibility:", newResponsibility);
    //todo: add repsonsibility optimistically before the db call
    this.responsibilities.push(newResponsibility);
  };
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
  var project = $state(new CRCProject());
  // project.cards = cardsData.map((record) => Card.fromDBRecord(record));
  // project.cards =
  project.cards = await DBfetchCRCProjectCards(project_id);

  console.log("Fetched project:", $state.snapshot(project));
  return project;
};

export const crcProject = await getProject(project_id);
