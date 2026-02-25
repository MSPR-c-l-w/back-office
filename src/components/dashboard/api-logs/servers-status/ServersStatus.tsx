import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerType } from "../mocks";
import { ServerCard } from "./ServerCard";

interface Props {
    servers: ServerType[],
}

export const ServersStatus = ({ servers }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des Serveurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {servers.map((server, index) => (
            <ServerCard key={index} server={server} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
