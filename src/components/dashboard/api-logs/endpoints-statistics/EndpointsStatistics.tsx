import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointsTable } from "./EndpointsTable";
import { EndpointType } from "../mocks";

interface Props {
    endpointsStats: EndpointType[]
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
