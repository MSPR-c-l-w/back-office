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
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#DBEAFE]">
            <Server className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-semibold text-[#4A5568]">{server.name}</h4>
            <p className="mt-0.5 text-xs text-[#475569]">
              Dernier redémarrage: {server.lastRestart}
            </p>
          </div>
        </div>
        <Badge
          variant={server.status === "online" ? "default" : "secondary"}
          className={
            server.status === "online"
              ? "bg-[#166534] text-white hover:bg-[#166534]"
              : "bg-[#B45309] text-white hover:bg-[#B45309]"
          }
        >
          {server.status === "online" ? "En ligne" : "Avertissement"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="mb-1 text-xs text-[#475569]">Uptime</p>
          <p className="text-sm font-semibold text-[#4A5568]">
            {server.uptime}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#475569]">Requêtes/h</p>
          <p className="text-sm font-semibold text-[#4A5568]">
            {server.requests}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs text-[#475569]">CPU</p>
          <Progress
            value={server.cpu}
            className="h-2"
            aria-label={`Utilisation CPU: ${server.cpu} pourcent`}
            style={
              {
                "--progress-background":
                  server.cpu > 80 ? "#DC2626" : "#1D4ED8",
              } as CSSProperties
            }
          />
          <p className="text-xs font-semibold text-[#4A5568] mt-1">
            {server.cpu}%
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs text-[#475569]">Mémoire</p>
          <Progress
            value={server.memory}
            className="h-2"
            aria-label={`Utilisation mémoire: ${server.memory} pourcent`}
            style={
              {
                "--progress-background":
                  server.memory > 85 ? "#DC2626" : "#0F766E",
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
