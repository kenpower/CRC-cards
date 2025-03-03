import { supabase } from "./supabase";

const project_id = "0";
// Update document content

const reportSupabseError = ({ error, status, statusText }, operation) => {
  console.error("Error:", operation, error);
  console.error("Status:", status);
  console.error("Status Text:", statusText);
};
const insertCard = async (card) => {
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

const fetchCRCProject = async () => {
  const response = await supabase
    .from("cards")
    .select("*")
    .eq("project_id", project_id);

  if (response.error) reportSupabseError(response, "fetchCRCProject");
  else {
    console.log("Fetched cards:", response.data);
    //card.id = data[0].card_id;
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
}

class CRCProject {
  cards = $state([]);

  addCard(name, position) {
    var card = new Card(name);
    card.left = position.left;
    card.top = position.top;
    this.cards.push(card);
    insertCard(card);
    console.log(this.cards);
  }
}

const getProject = (project_id) => {
  fetchCRCProject();

  var project = $state(new CRCProject());
  return project;
};
export const crcProject = getProject(project_id);
