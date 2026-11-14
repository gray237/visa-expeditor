CREATE TABLE IF NOT EXISTS visa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL CHECK (service IN ('passport', 'visa', 'immigration')),
  purpose TEXT NOT NULL CHECK (purpose IN ('tourism', 'business', 'transit', 'study', 'work')),
  passport_country CHAR(2) NOT NULL,
  destination CHAR(2) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(40),
  travel_start DATE,
  travel_end DATE,
  message VARCHAR(3000),
  status TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'in_review', 'submitted', 'decision', 'delivered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((travel_start IS NULL AND travel_end IS NULL) OR travel_end >= travel_start)
);

CREATE INDEX IF NOT EXISTS visa_applications_created_at_idx
  ON visa_applications (created_at DESC);
