DROP VIEW current_travel_status;

ALTER TABLE travel_status
    ADD COLUMN domestic_travel VARCHAR,
    ADD COLUMN no_entry_countries VARCHAR[],
    ADD COLUMN start_date TIMESTAMP,
    ADD COLUMN quarantine BOOLEAN,
    DROP COLUMN travel_advice,
    DROP COLUMN flight_status;

CREATE VIEW current_travel_status AS	
WITH most_recent AS (	
    SELECT country, MAX(updated) updated FROM travel_status GROUP BY country
  )	
SELECT travel_status.*	
FROM travel_status	
JOIN most_recent USING (country, updated);
