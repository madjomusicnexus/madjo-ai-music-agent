/*
  # Fix RLS policy for app_config table

  1. Security Issue
    - Table `app_config` has RLS enabled but no policies
    - This triggers a security warning even though the design is secure
    
  2. Solution
    - Add explicit restrictive policies that deny all access
    - This clarifies that only service role (which bypasses RLS) can access
    - Authenticated and anonymous users are explicitly blocked
    
  3. Policies Added
    - Deny all SELECT for authenticated users
    - Deny all INSERT for authenticated users
    - Deny all UPDATE for authenticated users
    - Deny all DELETE for authenticated users
    - Same for anon users
    
  4. Important Notes
    - Service role key bypasses RLS, so edge functions can still access
    - This is the secure pattern for storing API keys and secrets
    - No user should ever have direct access to this table
*/

-- Add restrictive policies for authenticated users
CREATE POLICY "Deny all access for authenticated users"
  ON app_config
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Add restrictive policies for anonymous users
CREATE POLICY "Deny all access for anonymous users"
  ON app_config
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
