

ALTER TABLE responsibilities RENAME COLUMN resp_id TO id;
ALTER TABLE responsibilities RENAME COLUMN responsibility_name TO name;

ALTER TABLE collaborators RENAME COLUMN collab_id TO id;
ALTER TABLE collaborators RENAME COLUMN collaborator_name TO name;

ALTER TABLE cards RENAME COLUMN card_id TO id;
ALTER TABLE projects RENAME COLUMN project_id TO id;