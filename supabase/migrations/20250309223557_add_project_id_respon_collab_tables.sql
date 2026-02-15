ALTER TABLE collaborators 
ADD COLUMN project_id INT REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE responsibilities 
ADD COLUMN project_id INT REFERENCES projects(id) ON DELETE CASCADE;

UPDATE collaborators 
SET project_id = (SELECT project_id FROM cards WHERE cards.id = collaborators.card_id)
WHERE project_id IS NULL;

UPDATE responsibilities 
SET project_id = (SELECT project_id FROM cards WHERE cards.id = responsibilities.card_id)
WHERE project_id IS NULL;

ALTER TABLE collaborators 
ALTER COLUMN project_id SET NOT NULL;

ALTER TABLE responsibilities 
ALTER COLUMN project_id SET NOT NULL;