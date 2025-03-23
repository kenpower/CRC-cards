ALTER TABLE projects 
    ALTER COLUMN base32_id SET DEFAULT random_crockford_base32(8);