// components/shared/PlaceholderImage.tsx
export default function PlaceholderImage({
  label = 'No Image',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 bg-gray-100 text-gray-500 flex items-center justify-center ${className}`}
      aria-label="Placeholder"
    >
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
