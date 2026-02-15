DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Unique User ID
  forename TEXT NOT NULL,                         -- First Name
  surname TEXT NOT NULL,                          -- Last Name
  display_name TEXT,                              -- Optional Display Name
  email TEXT UNIQUE NOT NULL,                     -- Unique Email
  created_at TIMESTAMP DEFAULT now()              -- Auto-generated timestamp
);

ALTER TABLE projects ADD COLUMN owner_id UUID;

ALTER TABLE projects 
ADD CONSTRAINT fk_projects_users 
FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;
