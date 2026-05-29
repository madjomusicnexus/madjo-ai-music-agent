/*
  # Create app_config table for secure API key storage

  1. New Tables
    - `app_config`
      - `id` (uuid, primary key)
      - `key` (text, unique) - config key name e.g. "GEMINI_API_KEY"
      - `value` (text) - the secret value
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `app_config` table
    - Only service role can read/write (no public or authenticated access)
    - This ensures the API key is only accessible from edge functions using the service role key
*/

CREATE TABLE IF NOT EXISTS app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- No policies for authenticated or anon users - only service role can access
-- Service role bypasses RLS, so edge functions using SUPABASE_SERVICE_ROLE_KEY can read it

-- Insert the Gemini API key
INSERT INTO app_config (key, value) VALUES ('GEMINI_API_KEY', 'AIzaSyByr-Ph2Oq_Y1zmrXHyIwrU8gkdKrdjHAg')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
