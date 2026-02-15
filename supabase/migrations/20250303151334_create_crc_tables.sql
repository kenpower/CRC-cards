CREATE TABLE projects (project_id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE cards (card_id SERIAL PRIMARY KEY, project_id INT REFERENCES projects, name TEXT, style JSON );
CREATE TABLE collaborators (collab_id SERIAL PRIMARY KEY, card_id INT REFERENCES cards, collaborator_name TEXT, display_order INT);
CREATE TABLE responsibilities (resp_id SERIAL PRIMARY KEY, card_id INT REFERENCES cards, responsibility_name TEXT, display_order INT);


alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table cards;
alter publication supabase_realtime add table collaborators;
alter publication supabase_realtime add table responsibilities;