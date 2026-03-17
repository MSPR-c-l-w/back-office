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
              <code className="text-sm text-[#4A90E2] bg-[#4A90E2] bg-opacity-10 px-2 py-1 rounded">
                {endpoint.endpoint}
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
