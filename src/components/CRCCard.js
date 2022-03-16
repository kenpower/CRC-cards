export default class CRCCard {
  constructor(title, responsibilities, collaborators) {
    this.id = self.crypto.randomUUID();

    this.title = title;
    this.collaborators = collaborators || [];
    this.responsibilities = responsibilities || [];
  }
}
