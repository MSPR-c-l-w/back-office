import { Badge } from "@/components/ui/badge";
import { ServerStatusType } from "./mocks";
import { Progress } from "@/components/ui/progress";

interface Props {
  server: ServerStatusType;
}

export const ServerStatusCard = ({ server }: Props) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              server.status === "online" ? "bg-[#5CC58C]" : "bg-[#FFB88C]"
            }`}
            aria-label={
              server.status === "online" ? "En ligne" : "Avertissement"
            }
          ></div>
          <h4 className="font-semibold text-[#4A5568]">{server.name}</h4>
        </div>
        <Badge
          variant="outline"
          className="bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]"
        >
          Uptime: {server.uptime}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#4A5568] opacity-70 mb-2">CPU</p>
          <Progress value={server.cpu} className="h-2" />
          <p className="text-sm font-semibold text-[#4A5568] mt-1">
            {server.cpu}%
          </p>
        </div>
        <div>
          <p className="text-xs text-[#4A5568] opacity-70 mb-2">Mémoire</p>
          <Progress value={server.memory} className="h-2" />
          <p className="text-sm font-semibold text-[#4A5568] mt-1">
            {server.memory}%
          </p>
        </div>
      </div>
    </div>
  );
};
