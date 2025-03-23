import { supabase } from "./supabase";
import { listenForChanges } from "./listenForChanges";

function getTempInt4() {
  return Math.floor(Math.random() * 2_000_000_000); // Avoids the max int4 limit
}

const reportSupabaseError = ({ error, status, statusText }, operation) => {
  console.error("Error:", operation, error);
  console.error("Status:", status);
  console.error("Status Text:", statusText);
};

export const DBinsertProject = async (projectData) => {
  // Default values for a new project
  const defaultProject = {
    name: projectData.name || "New Project",
    owner_id: projectData.owner_id || null,
    // cardCount: projectData.cardCount || 0,
    // lastEdit: projectData.lastEdit || new Date().toISOString(),
  };

  const response = await supabase
    .from("projects")
    .insert(defaultProject)
    .select("*")
    .single(); // Use .single() since we expect one row

  if (response.error) {
    reportSupabaseError(response, "insertProject");
    return null;
  } else {
    const record = response.data;
    console.log("Inserted project:", record);
    return record; // Return the inserted project data (including the generated ID)
  }
};

export const DBfetchProjects = async () => {
  const response = await supabase.from("projects")
    .select("*, cards(count), users(display_name) ");
  if (response.error) {
    reportSupabaseError(response, "fetchProjects");
    return [];
  }

  const data = response.data.map((record) => {
    record.cardCount = record.cards[0].count;
    return record;
  });
  console.log("Fetched projects:", data);
  return response.data;
};

export const DBdeleteProject = async (project_id) => {
  const response = await supabase.from("projects").delete().eq("id", project_id);

  if (response.error) reportSupabaseError(response, "deleteProject");
  else {
    console.log("Deleted project:", project_id);
    return true;
  }
};

const DBinsertCard = async (card) => {
  const response = await supabase
    .from("cards")
    .insert({
      project_id: card.projectId,
      name: card.name,
      style: card.style,
    })
    .select("*");

  if (response.error) reportSupabaseError(response, "insertCard");
  else {
    const record = response.data[0];
    console.log("Inserted record:", record);
    card.id = record.id;
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
    reportSupabaseError(response, "fetchCRCProjectCards");
    return null;
  } else {
    console.log("Fetched cards with relationships:", response.data);
    return response.data.map((record) => Card.fromDBRecord(record));
  }
};

const DBdeleteCard = async (cardId) => {
  const response = await supabase.from("cards").delete().eq("id", cardId);

  if (response.error) reportSupabaseError(response, "deleteCard");
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

  if (response.error) reportSupabaseError(response, "updateCard");
  else console.log("Updated card:", card.id);
};

const DBaddRow = async (table, row) => {
  const response = await supabase.from(table).insert(row).select("*");

  if (response.error) reportSupabaseError(response, "addRRow:" + table);
  else {
    const record = response.data[0];
    console.log("Inserted row into:" + table, record);
    return record;
  }
};

const DBdeleteRow = async (table, row) => {
  console.log("Deleting row in" + table + ":", row);
  const response = await supabase.from(table).delete().eq("id", row.id);

  if (response.error) reportSupabaseError(response, "deleteRow:" + table);
  else {
    console.log("Deleted row in" + table + ":", row);
    return true;
  }
};

const DBupdateRow = async (table, row) => {
  const response = await supabase.from(table).update(row).eq("id", row.id);

  if (response.error) reportSupabaseError(response, "updateRow:" + table);
  else console.log("Updated row in" + table + ":", row);
};

class Card {
  style = $state({ position: { left: 0, top: 0 } });
  name = $state("");
  collaborators = $state([]);
  responsibilities = $state([]);
  id = $state(-1);
  projectId = $state(null);

  constructor(name) {
    this.name = name;
  }

  static fromDBRecord(record) {
    var card = new Card(record.name);
    card.style = record.style || { position: { left: 0, top: 0 } };
    card.id = record.id;
    card.projectId = record.project_id;
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

  updateResponsibility = async (responsibility) => {
    // Arrow function ensures `this` stays bound
    DBupdateRow("responsibilities", responsibility);
    console.log("Updated responsibility:", responsibility);
  };

  updateCollaborator = async (collaborator) => {
    // Arrow function ensures `this` stays bound
    DBupdateRow("collaborators", collaborator);
    console.log("Updated collaborator:", collaborator);
  };

  deleteResponsibility = async (responsibility) => {
    // Arrow function ensures `this` stays bound
    if (DBdeleteRow("responsibilities", responsibility)) {
      this.responsibilities = this.responsibilities.filter(
        (resp) => resp.id !== responsibility.id
      );
      console.log("deleted responsibility:", responsibility);
    }
  };

  deleteCollaborator = async (collaborator) => {
    // Arrow function ensures `this` stays bound
    if (DBdeleteRow("collaborators", collaborator)) {
      this.collaborators = this.collaborators.filter(
        (collab) => collab.id !== collaborator.id
      );
      console.log("deleted collaborator:", collaborator);
    }
  };

  addResponsibility = async (name) => {
    // Arrow function ensures `this` stays bound
    console.log("Adding responsibility in card:", this);
    const responsibility = {
      name: name,
      display_order: 0,
      card_id: this.id,
      project_id: this.projectId,
    };

    console.log("Adding responsibility:", responsibility);

    const newResponsibility = await DBaddRow("responsibilities", responsibility);
    console.log("Added responsibility:", newResponsibility);
    //todo: add repsonsibility optimistically before the db call
    this.responsibilities.push(newResponsibility);
  };

  addCollaborator = async (name) => {
    console.log("Adding collaborator in card:", this);
    const collaborator = {
      name: name,
      display_order: 0,
      card_id: this.id,
      project_id: this.projectId,
    };

    const newCollaborator = await DBaddRow("collaborators", collaborator);
    console.log("Added collaborator:", newCollaborator);
    this.collaborators.push(newCollaborator);
  };
}

class CRCProject {
  cards = $state([]);

  constructor(projectData) {
    this.id = projectData.id;
    this.name = projectData.name;
    this.owner_id = projectData.owner_id;
    this.base32_id = projectData.base32_id;
    this.ownerDisplayName = projectData.ownerDisplayName;
  }

  addCard(name, position) {
    var card = new Card(name);
    card.projectId = this.id;
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

export const getProject = async (project_id) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*, cards(count), users(display_name) ")
    .eq("id", project_id)
    .single();

  if (error) {
    reportSupabaseError(response, "fetchProjects");
    return null;
  }

  const ownerDisplayName = data?.users?.display_name ?? "Unknown";

  console.log(data);

  var project = new CRCProject(data);
  // project.cards = cardsData.map((record) => Card.fromDBRecord(record));
  // project.cards =
  project.cards = await DBfetchCRCProjectCards(project_id);

  console.log("Fetched project:", project);
  return project;
};

export const listenForProjectChanges = async (project_id, updateProject) =>
  listenForChanges(project_id, supabase, updateProject);

export const stopListeningForProjectChanges = () =>
  supabase.removeAllChannels();

export const deleteProject = async (project_id) => {
  if (DBdeleteProject(project_id)) {
    console.log("Deleted project:", project_id);
    return true;
  }
};
