import type { ConversionType } from "./mocks";

type Props = { items: ConversionType[] };

export function ConversionLegend({ items }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="text-sm text-[#4A5568]">{item.name}</span>
          </div>
          <span className="text-sm font-semibold text-[#4A5568]">
            {item.value.toLocaleString()} utilisateurs
          </span>
        </div>
      ))}
    </div>
  );
}
