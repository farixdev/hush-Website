-- Optional: the site creates this table automatically on first use.
-- Provided here for reference / manual setup on Neon.

CREATE TABLE IF NOT EXISTS versions (
  id          SERIAL PRIMARY KEY,
  version     TEXT        NOT NULL,
  changelog   TEXT        NOT NULL DEFAULT '',
  size_bytes  BIGINT      NOT NULL DEFAULT 0,
  apk_url     TEXT        NOT NULL,
  apk_pathname TEXT,
  downloads   INTEGER     NOT NULL DEFAULT 0,
  is_latest   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
