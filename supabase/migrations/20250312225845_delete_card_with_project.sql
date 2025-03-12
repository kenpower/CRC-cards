ALTER TABLE cards DROP CONSTRAINT cards_project_id_fkey;

ALTER TABLE cards
ADD CONSTRAINT cards_project_id_fkey
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;