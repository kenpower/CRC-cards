-- Drop existing constraints (if they exist)
ALTER TABLE collaborators
  DROP CONSTRAINT collaborators_card_id_fkey;

ALTER TABLE responsibilities
  DROP CONSTRAINT responsibilities_card_id_fkey;

-- Recreate constraints with ON DELETE CASCADE
ALTER TABLE collaborators
  ADD CONSTRAINT collaborators_card_id_fkey
  FOREIGN KEY (card_id) REFERENCES cards(id)
  ON DELETE CASCADE;

ALTER TABLE responsibilities
  ADD CONSTRAINT responsibilities_card_id_fkey
  FOREIGN KEY (card_id) REFERENCES cards(id)
  ON DELETE CASCADE;