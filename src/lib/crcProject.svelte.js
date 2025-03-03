class Card {
  position = $state({ left: 0, top: 0 });
  name = $state("");
  collaborators = $state([]);
  responsibilities = $state([]);

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
    console.log(this.cards);
  }
}

export const crcProject = $state(new CRCProject());
