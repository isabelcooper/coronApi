DROP VIEW current_travel_status;

ALTER TABLE travel_status
    ADD COLUMN iso VARCHAR(3);

CREATE VIEW current_travel_status AS	
WITH most_recent AS (	
    SELECT country, MAX(updated) updated FROM travel_status GROUP BY country
  )	
SELECT travel_status.*	
FROM travel_status	
JOIN most_recent USING (country, updated);
