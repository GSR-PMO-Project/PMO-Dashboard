import "../../styles/shared.css";

function FormField({ label, type = "text", value, onChange, options, required, error }) {
  return (
    <label className="form-field">
      {label}
      {type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export default FormField;