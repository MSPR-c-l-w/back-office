import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EndpointStat } from "../types";

interface Props {
  endpointsStats: EndpointStat[];
}

export const EndpointsTable = ({ endpointsStats }: Props) => {
  const getMethodColor = (method: string): string => {
    const upper = method.toUpperCase();
    if (upper === "GET") return "#EF4444"; // rouge
    if (upper === "POST") return "#22C55E"; // vert
    if (upper === "PUT") return "#FACC15"; // jaune
    if (upper === "DELETE") return "#FB923C"; // orange
    return "#E5E7EB"; // gris clair par défaut
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Endpoint</TableHead>
          <TableHead className="text-right">Appels</TableHead>
          <TableHead className="text-right">Latence Moy.</TableHead>
          <TableHead className="text-right">Erreurs</TableHead>
          <TableHead className="text-right">Taux de Succès</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {endpointsStats.map((endpoint, index) => (
          <TableRow key={index}>
            <TableCell>
              <code className="inline-flex items-center gap-2 rounded px-2 py-1 bg-[#020617] text-xs text-white">
                {(() => {
                  const [method, ...rest] = endpoint.endpoint.split(" ");
                  const path = rest.join(" ") || "";
                  return (
                    <>
                      <span
                        style={{ color: getMethodColor(method) }}
                        className="font-semibold"
                      >
                        {method}
                      </span>
                      <span className="text-white/90">{path}</span>
                    </>
                  );
                })()}
              </code>
            </TableCell>
            <TableCell className="text-right text-[#4A5568] font-medium">
              {endpoint.calls.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <span
                className={`font-medium ${
                  endpoint.avgLatency > 300
                    ? "text-[#FF887B]"
                    : "text-[#5CC58C]"
                }`}
              >
                {endpoint.avgLatency}ms
              </span>
            </TableCell>
            <TableCell className="text-right">
              <span
                className={`font-medium ${
                  endpoint.errors > 20 ? "text-[#FF887B]" : "text-[#4A5568]"
                }`}
              >
                {endpoint.errors}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-[#5CC58C] hover:bg-[#5CC58C]">
                {endpoint.successRate}%
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
