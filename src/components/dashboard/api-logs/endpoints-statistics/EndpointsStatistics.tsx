import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointsTable } from "./EndpointsTable";
import { EndpointStat } from "../types";

interface Props {
  endpointsStats: EndpointStat[];
}

export const EndpointsStatistics = ({ endpointsStats }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques des Endpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <EndpointsTable endpointsStats={endpointsStats} />
        </div>
      </CardContent>
    </Card>
  );
};
