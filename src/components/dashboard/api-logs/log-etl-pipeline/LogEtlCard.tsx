import { Badge } from "@/components/ui/badge";
import { RecentLogType } from "../mocks";

interface Props {
    log: RecentLogType
}

export const LogEtlCard = ({ log }: Props) => {
  return (
    <div
      key={log.id}
      className="p-4 rounded-lg border-l-4 hover:bg-gray-50 transition-colors"
      style={{
        borderLeftColor:
          log.level === "error"
            ? "#FF887B"
            : log.level === "warning"
              ? "#FFB88C"
              : "#5CC58C",
        backgroundColor:
          log.level === "error"
            ? "#FF887B05"
            : log.level === "warning"
              ? "#FFB88C05"
              : "#5CC58C05",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <Badge
            className={`uppercase ${
              log.level === "error"
                ? "bg-[#FF887B] hover:bg-[#FF887B]"
                : log.level === "warning"
                  ? "bg-[#FFB88C] hover:bg-[#FFB88C]"
                  : "bg-[#5CC58C] hover:bg-[#5CC58C]"
            }`}
          >
            {log.level}
          </Badge>
          <span className="text-sm font-medium text-[#4A5568]">
            {log.service}
          </span>
        </div>
        <span className="text-xs text-[#4A5568] opacity-70">
          {log.timestamp}
        </span>
      </div>
      <p className="text-sm text-[#4A5568] mb-1">{log.message}</p>
      <code className="text-xs text-[#4A5568] opacity-70 font-mono bg-gray-100 px-2 py-1 rounded">
        {log.details}
      </code>
    </div>
  );
};
