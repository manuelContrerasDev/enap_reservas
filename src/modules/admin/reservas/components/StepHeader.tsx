// StepHeader.tsx
export const StepHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="mb-6">
    <h2 className="text-xl font-bold text-[#00394F]">{title}</h2>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
  </header>
);
