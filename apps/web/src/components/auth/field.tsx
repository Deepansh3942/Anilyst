type FieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

export function Field({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  error,
  placeholder,
}: FieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full border border-[var(--border)] bg-[var(--field)] px-3.5 py-2.5 text-[0.95rem] text-[var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]"
        style={{ borderRadius: "0.7rem" }}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-1.5 block text-sm text-[var(--danger)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
