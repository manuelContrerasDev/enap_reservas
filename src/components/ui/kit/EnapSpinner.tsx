// src/ui/EnapSpinner.tsx
export default function EnapSpinner({ size = 30 }) {
  return (
    <div
      className="border-4 border-cian-200 border-t-cian-600 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
