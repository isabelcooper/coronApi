DROP VIEW current_travel_status;

CREATE VIEW current_travel_status AS
WITH most_recent AS (
    SELECT iso, MAX(updated) updated FROM travel_status GROUP BY iso
  )
SELECT travel_status.*
FROM travel_status
JOIN most_recent USING (iso, updated);
