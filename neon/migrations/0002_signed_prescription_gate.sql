-- Clinovyra commercial: relational authorization prerequisites. No grants or RLS policies.
-- The server must validate identity, organization membership, signatures and audit events.
ALTER TABLE clinovyra.encounters
  ADD CONSTRAINT encounters_org_patient_id_uq UNIQUE (organization_id, patient_id, id),
  ADD CONSTRAINT encounters_org_patient_status_id_uq UNIQUE (organization_id, patient_id, id, status);
ALTER TABLE clinovyra.clinical_notes
  ADD CONSTRAINT notes_org_patient_encounter_status_hash_id_uq
    UNIQUE (organization_id, patient_id, encounter_id, id, status, signed_hash),
  ADD CONSTRAINT final_note_has_signed_hash
    CHECK (status <> 'final' OR (signed_hash IS NOT NULL AND length(signed_hash) >= 32)),
  ADD CONSTRAINT note_matches_encounter_patient
    FOREIGN KEY (organization_id, patient_id, encounter_id)
    REFERENCES clinovyra.encounters (organization_id, patient_id, id);
ALTER TABLE clinovyra.prescriptions
  ADD COLUMN encounter_id uuid NOT NULL,
  ADD COLUMN note_id uuid NOT NULL,
  ADD COLUMN signed_note_hash text NOT NULL,
  ADD COLUMN encounter_status text NOT NULL DEFAULT 'final' CHECK (encounter_status = 'final'),
  ADD COLUMN note_status text NOT NULL DEFAULT 'final' CHECK (note_status = 'final'),
  ADD COLUMN voided_at timestamptz,
  ADD COLUMN void_reason text,
  ADD CONSTRAINT prescription_final_encounter_fk
    FOREIGN KEY (organization_id, patient_id, encounter_id, encounter_status)
    REFERENCES clinovyra.encounters (organization_id, patient_id, id, status),
  ADD CONSTRAINT prescription_signed_final_note_fk
    FOREIGN KEY (organization_id, patient_id, encounter_id, note_id, note_status, signed_note_hash)
    REFERENCES clinovyra.clinical_notes (organization_id, patient_id, encounter_id, id, status, signed_hash),
  ADD CONSTRAINT void_reason_required
    CHECK (status <> 'void' OR (voided_at IS NOT NULL AND length(trim(void_reason)) > 0));
-- Existing RLS FORCE and no-grant stance from migration 0001 remains in force.
