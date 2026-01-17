interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function UsaPiscinaToggle({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5"
      />
      <span className="font-medium text-gray-800">
        Incluir uso de piscina en esta reserva
      </span>
    </label>
  );
}
