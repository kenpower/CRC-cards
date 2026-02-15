function getTempInt4() {
  return Math.floor(Math.random() * 2_000_000_000); // Avoids the max int4 limit
}

const handleResponse = async (response, operation) => {
  if (!response.ok) {
    const error = await response.json();
    console.error(`Error in ${operation}:`, error);
    return { error };
  }
  return { data: await response.json() };
};

export const DBinsertProject = async (projectData) => {
  const { data, error } = await handleResponse(
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: projectData.name || "New Project",
        owner_id: projectData.owner_id || null,
      }),
    }),
    "insertProject"
  );

  if (error) return null;
  console.log("Inserted project:", data);
  return data;
};

export const DBfetchProjects = async (owner_id) => {
  const url = owner_id ? `/api/projects?owner_id=${owner_id}` : "/api/projects";
  const { data, error } = await handleResponse(await fetch(url), "fetchProjects");

  if (error) return [];
  console.log("Fetched projects:", data);
  return data;
};

export const DBdeleteProject = async (project_id) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/projects?id=${project_id}`, { method: "DELETE" }),
    "deleteProject"
  );

  if (error) return false;
  console.log("Deleted project:", project_id);
  return true;
};

const DBinsertCard = async (card) => {
  const { data, error } = await handleResponse(
    await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: card.projectId,
        name: card.name,
        style: card.style,
      }),
    }),
    "insertCard"
  );

  if (error) return;
  console.log("Inserted card:", data);
  card.id = data.id;
};

const DBfetchCRCProjectCards = async (project_id) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/cards?project_id=${project_id}`),
    "fetchCRCProjectCards"
  );

  if (error) return null;
  console.log("Fetched cards:", data);
  return data.map((record) => Card.fromDBRecord(record));
};

const DBdeleteCard = async (cardId) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/cards?id=${cardId}`, { method: "DELETE" }),
    "deleteCard"
  );

  if (error) return false;
  console.log("Deleted card:", cardId);
  return true;
};

const DBupdateCard = async (card) => {
  const { data, error } = await handleResponse(
    await fetch("/api/cards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: card.id,
        style: card.style,
        name: card.name,
      }),
    }),
    "updateCard"
  );

  if (!error) console.log("Updated card:", card.id);
};

const DBaddRow = async (table, row) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/${table}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    }),
    `addRow:${table}`
  );

  if (error) return null;
  console.log(`Inserted row into ${table}:`, data);
  return data;
};

const DBdeleteRow = async (table, row) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/${table}?id=${row.id}`, { method: "DELETE" }),
    `deleteRow:${table}`
  );

  if (error) return false;
  console.log(`Deleted row in ${table}:`, row.id);
  return true;
};

const DBupdateRow = async (table, row) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/${table}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    }),
    `updateRow:${table}`
  );

  if (!error) console.log(`Updated row in ${table}:`, row.id);
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
    DBupdateRow("responsibilities", responsibility);
  };

  updateCollaborator = async (collaborator) => {
    DBupdateRow("collaborators", collaborator);
  };

  deleteResponsibility = async (responsibility) => {
    if (await DBdeleteRow("responsibilities", responsibility)) {
      this.responsibilities = this.responsibilities.filter(
        (resp) => resp.id !== responsibility.id
      );
    }
  };

  deleteCollaborator = async (collaborator) => {
    if (await DBdeleteRow("collaborators", collaborator)) {
      this.collaborators = this.collaborators.filter(
        (collab) => collab.id !== collaborator.id
      );
    }
  };

  addResponsibility = async (name) => {
    const responsibility = {
      name: name,
      display_order: 0,
      card_id: this.id,
      project_id: this.projectId,
    };
    const newResponsibility = await DBaddRow("responsibilities", responsibility);
    if (newResponsibility) {
      this.responsibilities.push(newResponsibility);
    }
  };

  addCollaborator = async (name) => {
    const collaborator = {
      name: name,
      display_order: 0,
      card_id: this.id,
      project_id: this.projectId,
    };
    const newCollaborator = await DBaddRow("collaborators", collaborator);
    if (newCollaborator) {
      this.collaborators.push(newCollaborator);
    }
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
  }

  async deleteCard(id) {
    if (await DBdeleteCard(id))
      this.cards = this.cards.filter((card) => card.id !== id);
  }

  updateCard(card) {
    DBupdateCard(card);
  }
}

export const getProject = async (project_id) => {
  const { data, error } = await handleResponse(
    await fetch(`/api/projects?id=${project_id}`),
    "getProject"
  );

  if (error) return null;

  var project = new CRCProject(data);
  project.cards = await DBfetchCRCProjectCards(project_id);
  return project;
};

export const listenForProjectChanges = async (project_id, updateProject) => {
  console.warn("Real-time updates are currently disabled.");
};

export const stopListeningForProjectChanges = () => {};

export const deleteProject = async (project_id) => {
  return await DBdeleteProject(project_id);
};
