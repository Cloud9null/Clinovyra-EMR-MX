-- Apply to a new Clinovyra-owned project after 0001 and 0002.
-- Subscription state is written only by a trusted billing/trial service; no client grants.
ALTER TABLE clinovyra.subscription_accounts
  ADD COLUMN plan text NOT NULL DEFAULT 'lite' CHECK (plan IN ('lite', 'premium')),
  ADD COLUMN trial_started_at timestamptz,
  ADD COLUMN trial_ends_at timestamptz,
  ADD COLUMN current_period_ends_at timestamptz,
  ADD CONSTRAINT valid_trial_window CHECK (
    (trial_started_at IS NULL AND trial_ends_at IS NULL)
    OR (trial_started_at IS NOT NULL AND trial_ends_at > trial_started_at)
  ),
  ADD CONSTRAINT trial_has_end CHECK (status <> 'trial' OR trial_ends_at IS NOT NULL),
  ADD CONSTRAINT active_has_period CHECK (status <> 'active' OR current_period_ends_at IS NOT NULL);
CREATE INDEX subscription_expiry_idx ON clinovyra.subscription_accounts (status, trial_ends_at, current_period_ends_at);
CREATE INDEX memberships_org_role_idx ON clinovyra.memberships (organization_id, role, status);
