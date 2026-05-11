type OptionGroupProps = {
  title: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

export function OptionGroup({ title, options, value, onChange }: OptionGroupProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`dark-option ${value === option ? "dark-option-active" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
