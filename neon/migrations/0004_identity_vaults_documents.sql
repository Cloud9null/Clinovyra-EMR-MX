-- Clinovyra: verified identity is bound to one invited doctor account.
-- The application role never gets privileges on the legacy clinical tables.
CREATE TABLE clinovyra.account_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  email text NOT NULL CHECK (email = lower(trim(email)) AND length(email) BETWEEN 5 AND 320),
  role text NOT NULL CHECK (role IN ('owner', 'doctor')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  invited_by text NOT NULL,
  accepted_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE (organization_id, email),
  CHECK ((status = 'accepted') = (accepted_by IS NOT NULL AND accepted_at IS NOT NULL))
);
CREATE INDEX invitations_email_idx ON clinovyra.account_invitations (email, status);

CREATE TABLE clinovyra.encrypted_vaults (
  auth_user_id text PRIMARY KEY,
  organization_id uuid NOT NULL,
  meta jsonb NOT NULL CHECK (jsonb_typeof(meta) = 'object' AND octet_length(meta::text) < 65536),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND octet_length(payload::text) < 10485760),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, auth_user_id),
  FOREIGN KEY (organization_id, auth_user_id)
    REFERENCES clinovyra.memberships (organization_id, auth_user_id)
);
CREATE INDEX vaults_org_idx ON clinovyra.encrypted_vaults (organization_id);

CREATE TABLE clinovyra.encrypted_documents (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL,
  auth_user_id text NOT NULL,
  object_key text NOT NULL UNIQUE,
  mime_type text NOT NULL,
  byte_size integer NOT NULL CHECK (byte_size BETWEEN 1 AND 10485760),
  ciphertext_sha256 text NOT NULL CHECK (length(ciphertext_sha256) = 64),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (organization_id, auth_user_id)
    REFERENCES clinovyra.memberships (organization_id, auth_user_id)
);
CREATE INDEX documents_owner_idx ON clinovyra.encrypted_documents (organization_id, auth_user_id);

ALTER TABLE clinovyra.account_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinovyra.account_invitations FORCE ROW LEVEL SECURITY;
ALTER TABLE clinovyra.encrypted_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinovyra.encrypted_vaults FORCE ROW LEVEL SECURITY;
ALTER TABLE clinovyra.encrypted_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinovyra.encrypted_documents FORCE ROW LEVEL SECURITY;

-- App identity is set only inside a server-side transaction after Neon Auth session verification.
CREATE POLICY membership_self_read ON clinovyra.memberships FOR SELECT TO clinovyra_app
  USING (auth_user_id = current_setting('app.user_id', true));
CREATE POLICY membership_claim ON clinovyra.memberships FOR INSERT TO clinovyra_app
  WITH CHECK (
    auth_user_id = current_setting('app.user_id', true) AND status = 'active'
    AND EXISTS (
      SELECT 1 FROM clinovyra.account_invitations i
      WHERE i.organization_id = memberships.organization_id
        AND i.email = current_setting('app.user_email', true)
        AND i.role = memberships.role AND i.status = 'pending'
    )
  );
CREATE POLICY invitation_read ON clinovyra.account_invitations FOR SELECT TO clinovyra_app
  USING (
    email = current_setting('app.user_email', true)
    OR EXISTS (
      SELECT 1 FROM clinovyra.memberships m
      WHERE m.organization_id = account_invitations.organization_id
        AND m.auth_user_id = current_setting('app.user_id', true)
        AND m.role = 'owner' AND m.status = 'active'
    )
  );
CREATE POLICY invitation_owner_create ON clinovyra.account_invitations FOR INSERT TO clinovyra_app
  WITH CHECK (
    role = 'doctor' AND status = 'pending'
    AND invited_by = current_setting('app.user_id', true)
    AND EXISTS (
      SELECT 1 FROM clinovyra.memberships m
      WHERE m.organization_id = account_invitations.organization_id
        AND m.auth_user_id = current_setting('app.user_id', true)
        AND m.role = 'owner' AND m.status = 'active'
    )
  );
CREATE POLICY invitation_accept ON clinovyra.account_invitations FOR UPDATE TO clinovyra_app
  USING (email = current_setting('app.user_email', true) AND status = 'pending')
  WITH CHECK (email = current_setting('app.user_email', true)
    AND status = 'accepted' AND accepted_by = current_setting('app.user_id', true));
CREATE POLICY organization_member_read ON clinovyra.organizations FOR SELECT TO clinovyra_app
  USING (EXISTS (
    SELECT 1 FROM clinovyra.memberships m WHERE m.organization_id = organizations.id
      AND m.auth_user_id = current_setting('app.user_id', true) AND m.status = 'active'
  ));
CREATE POLICY vault_owner ON clinovyra.encrypted_vaults FOR ALL TO clinovyra_app
  USING (auth_user_id = current_setting('app.user_id', true)
    AND EXISTS (SELECT 1 FROM clinovyra.memberships m
      WHERE m.organization_id = encrypted_vaults.organization_id
        AND m.auth_user_id = current_setting('app.user_id', true) AND m.status = 'active'))
  WITH CHECK (auth_user_id = current_setting('app.user_id', true)
    AND EXISTS (SELECT 1 FROM clinovyra.memberships m
      WHERE m.organization_id = encrypted_vaults.organization_id
        AND m.auth_user_id = current_setting('app.user_id', true) AND m.status = 'active'));
CREATE POLICY document_owner ON clinovyra.encrypted_documents FOR ALL TO clinovyra_app
  USING (auth_user_id = current_setting('app.user_id', true)
    AND EXISTS (SELECT 1 FROM clinovyra.memberships m
      WHERE m.organization_id = encrypted_documents.organization_id
        AND m.auth_user_id = current_setting('app.user_id', true) AND m.status = 'active'))
  WITH CHECK (auth_user_id = current_setting('app.user_id', true)
    AND EXISTS (SELECT 1 FROM clinovyra.memberships m
      WHERE m.organization_id = encrypted_documents.organization_id
        AND m.auth_user_id = current_setting('app.user_id', true) AND m.status = 'active'));

GRANT USAGE ON SCHEMA clinovyra TO clinovyra_app;
GRANT SELECT ON clinovyra.organizations TO clinovyra_app;
GRANT SELECT, INSERT ON clinovyra.memberships TO clinovyra_app;
GRANT SELECT, INSERT, UPDATE (status, accepted_by, accepted_at)
  ON clinovyra.account_invitations TO clinovyra_app;
GRANT SELECT, INSERT, UPDATE (meta, payload, version, updated_at)
  ON clinovyra.encrypted_vaults TO clinovyra_app;
GRANT SELECT, INSERT ON clinovyra.encrypted_documents TO clinovyra_app;

-- Bootstrap invitation, not a privileged account. Only an email-verified Neon Auth
-- session with this address may claim the owner membership through the API.
WITH owner_org AS (
  INSERT INTO clinovyra.organizations (name) VALUES ('Clinovyra · Propietario') RETURNING id
)
INSERT INTO clinovyra.account_invitations (organization_id, email, role, invited_by)
SELECT id, 'freematrix7@proton.me', 'owner', 'system:bootstrap' FROM owner_org;
