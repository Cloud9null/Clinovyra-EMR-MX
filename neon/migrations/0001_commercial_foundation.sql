-- Clinovyra commercial development schema. No personal data and no public API access.
-- Access policies deliberately deny all until trusted API + Neon Auth identity mapping is tested.
CREATE SCHEMA IF NOT EXISTS clinovyra;

CREATE TABLE clinovyra.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 160),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id)
);
CREATE TABLE clinovyra.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  auth_user_id text NOT NULL CHECK (length(auth_user_id) > 0),
  role text NOT NULL CHECK (role IN ('owner','admin','doctor','assistant')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, auth_user_id)
);
CREATE INDEX memberships_user_idx ON clinovyra.memberships (auth_user_id, status);

CREATE TABLE clinovyra.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  -- This encrypted blob is a placeholder; final field-level encryption requires review.
  encrypted_record bytea NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id)
);
CREATE INDEX patients_org_idx ON clinovyra.patients (organization_id, created_at DESC);

CREATE TABLE clinovyra.encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  patient_id uuid NOT NULL,
  author_user_id text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','final','void')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, patient_id) REFERENCES clinovyra.patients (organization_id, id)
);
CREATE INDEX encounters_patient_idx ON clinovyra.encounters (organization_id, patient_id, created_at DESC);

CREATE TABLE clinovyra.clinical_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  patient_id uuid NOT NULL,
  encounter_id uuid NOT NULL,
  author_user_id text NOT NULL,
  encrypted_note bytea NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','final','void')),
  signed_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, patient_id) REFERENCES clinovyra.patients (organization_id, id),
  FOREIGN KEY (organization_id, encounter_id) REFERENCES clinovyra.encounters (organization_id, id)
);
CREATE INDEX notes_patient_idx ON clinovyra.clinical_notes (organization_id, patient_id, created_at DESC);

CREATE TABLE clinovyra.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  patient_id uuid NOT NULL,
  author_user_id text NOT NULL,
  encrypted_prescription bytea NOT NULL,
  seal_hash text NOT NULL,
  serial text NOT NULL,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','void')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, serial),
  FOREIGN KEY (organization_id, patient_id) REFERENCES clinovyra.patients (organization_id, id)
);
CREATE INDEX prescriptions_patient_idx ON clinovyra.prescriptions (organization_id, patient_id, created_at DESC);

CREATE TABLE clinovyra.subscription_accounts (
  organization_id uuid PRIMARY KEY REFERENCES clinovyra.organizations(id),
  provider_customer_id text UNIQUE,
  provider_subscription_id text UNIQUE,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive','trial','active','past_due','canceled')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE clinovyra.audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES clinovyra.organizations(id),
  actor_user_id text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_org_idx ON clinovyra.audit_events (organization_id, occurred_at DESC);

REVOKE ALL ON SCHEMA clinovyra FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA clinovyra FROM PUBLIC;
DO $$
DECLARE tablename text;
BEGIN
  FOREACH tablename IN ARRAY ARRAY['organizations','memberships','patients','encounters','clinical_notes','prescriptions','subscription_accounts','audit_events']
  LOOP
    EXECUTE format('ALTER TABLE clinovyra.%I ENABLE ROW LEVEL SECURITY', tablename);
    EXECUTE format('ALTER TABLE clinovyra.%I FORCE ROW LEVEL SECURITY', tablename);
  END LOOP;
END $$;
-- No policies and no grants: deny by default. Add scoped policies only after server auth tests.
