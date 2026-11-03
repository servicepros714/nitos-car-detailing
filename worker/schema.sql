-- Live schema of D1 database "detailing-bookings-detailingmarketers2" (account detailingmarketers2, WNAM)
-- Shared with the other sites on this account; rows are scoped by `source`.
-- Safe to run against the existing shared DB — uses IF NOT EXISTS only.
CREATE TABLE IF NOT EXISTS bookings (
  id              TEXT PRIMARY KEY,
  date            TEXT NOT NULL,
  time            TEXT NOT NULL,
  service         TEXT,
  name            TEXT,
  phone           TEXT,
  email           TEXT,
  vehicle         TEXT,
  address         TEXT,
  notes           TEXT,
  source          TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  status          TEXT DEFAULT 'Confirmed',
  reschedule_date TEXT,
  reschedule_time TEXT,
  notes2          TEXT,
  original_date   TEXT,
  original_time   TEXT,
  payment_status  TEXT DEFAULT 'Paid',
  payment_intent_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_bookings_source_date ON bookings (source, date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (payment_intent_id);
