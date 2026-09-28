// These handle names are intentionally the same generic names styled
// contextually by creatureEditForm.scss and citizenEditForm.scss (e.g.
// `.grid6 .input` overrides) — renaming them would detach the field from
// both forms' styling.
const FormFieldHandles = ['fieldGroup', 'label', 'input', 'textarea'] as const;

export default FormFieldHandles;
