-- Crockford Base32 is a human-friendly, compact, and efficient encoding system for IDs, 
-- designed to be easy to read, write, and communicate by avoiding ambiguous characters like I, L, O, and U. It is shorter than UUIDs, 
-- URL- and filename-safe, and ideal for public IDs, database keys, and distributed systems.
-- Unlike Base64, it contains only alphanumeric characters, making it safe for APIs and file storage without special encoding. 

CREATE OR REPLACE FUNCTION random_crockford_base32(length INT DEFAULT 8) 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    result TEXT := '';
    val INT;
BEGIN
    FOR i IN 1..length LOOP
        val := floor(random() * 32)::INT;
        result := result || substr(chars, val + 1, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE projects ADD COLUMN base32_id TEXT UNIQUE DEFAULT random_crockford_base32(10);
CREATE UNIQUE INDEX base32_id_idx ON projects(base32_id);
