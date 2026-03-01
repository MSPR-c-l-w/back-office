import { Server } from "lucide-react";
import { ServerType } from "../mocks";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CSSProperties } from "react";

interface Props {
  server: ServerType;
}

export const ServerCard = ({ server }: Props) => {
  return (
    <div className="p-5 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4A90E2] bg-opacity-10">
            <Server className="w-5 h-5 text-[#4A90E2]" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-semibold text-[#4A5568]">{server.name}</h4>
            <p className="text-xs text-[#4A5568] opacity-70 mt-0.5">
              Dernier redémarrage: {server.lastRestart}
            </p>
          </div>
        </div>
        <Badge
          variant={server.status === "online" ? "default" : "secondary"}
          className={
            server.status === "online"
              ? "bg-[#5CC58C] hover:bg-[#5CC58C]"
              : "bg-[#FFB88C] hover:bg-[#FFB88C]"
          }
        >
          {server.status === "online" ? "En ligne" : "Avertissement"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-[#4A5568] opacity-70 mb-1">Uptime</p>
          <p className="text-sm font-semibold text-[#4A5568]">
            {server.uptime}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#4A5568] opacity-70 mb-1">Requêtes/h</p>
          <p className="text-sm font-semibold text-[#4A5568]">
            {server.requests}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#4A5568] opacity-70 mb-2">CPU</p>
          <Progress
            value={server.cpu}
            className="h-2"
            style={
              {
                "--progress-background":
                  server.cpu > 80 ? "#FF887B" : "#4A90E2",
              } as CSSProperties
            }
          />
          <p className="text-xs font-semibold text-[#4A5568] mt-1">
            {server.cpu}%
          </p>
        </div>
        <div>
          <p className="text-xs text-[#4A5568] opacity-70 mb-2">Mémoire</p>
          <Progress
            value={server.memory}
            className="h-2"
            style={
              {
                "--progress-background":
                  server.memory > 85 ? "#FF887B" : "#7FD8BE",
              } as CSSProperties
            }
          />
          <p className="text-xs font-semibold text-[#4A5568] mt-1">
            {server.memory}%
          </p>
        </div>
      </div>
    </div>
  );
};
