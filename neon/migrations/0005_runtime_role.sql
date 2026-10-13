-- Corrective security migration: API-created Neon roles inherit neon_superuser
-- and can bypass RLS. The web app must connect as this SQL-created role only.
CREATE ROLE clinovyra_runtime NOLOGIN NOINHERIT NOBYPASSRLS NOCREATEROLE;

GRANT USAGE ON SCHEMA clinovyra TO clinovyra_runtime;
GRANT SELECT ON clinovyra.organizations TO clinovyra_runtime;
GRANT SELECT, INSERT ON clinovyra.memberships TO clinovyra_runtime;
GRANT SELECT, INSERT, UPDATE (status, accepted_by, accepted_at)
  ON clinovyra.account_invitations TO clinovyra_runtime;
GRANT SELECT, INSERT, UPDATE (meta, payload, version, updated_at)
  ON clinovyra.encrypted_vaults TO clinovyra_runtime;
GRANT SELECT, INSERT ON clinovyra.encrypted_documents TO clinovyra_runtime;

-- Move all policies to the non-bypass role. The previous API-created role
-- must never be used for clinical requests, even with FORCE RLS enabled.
ALTER POLICY membership_self_read ON clinovyra.memberships TO clinovyra_runtime;
ALTER POLICY membership_claim ON clinovyra.memberships TO clinovyra_runtime;
ALTER POLICY invitation_read ON clinovyra.account_invitations TO clinovyra_runtime;
ALTER POLICY invitation_owner_create ON clinovyra.account_invitations TO clinovyra_runtime;
ALTER POLICY invitation_accept ON clinovyra.account_invitations TO clinovyra_runtime;
ALTER POLICY organization_member_read ON clinovyra.organizations TO clinovyra_runtime;
ALTER POLICY vault_owner ON clinovyra.encrypted_vaults TO clinovyra_runtime;
ALTER POLICY document_owner ON clinovyra.encrypted_documents TO clinovyra_runtime;

-- After applying: set a randomly generated password, enable LOGIN, set the
-- pooled DATABASE_URL on Vercel, redeploy, and retire the old API-created role.
