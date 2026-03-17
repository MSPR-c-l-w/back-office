import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerStatus } from "../types";
import { ServerCard } from "./ServerCard";

interface Props {
  server: ServerStatus;
}

export const ServersStatus = ({ server }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des Serveurs</CardTitle>
      </CardHeader>
      <CardContent>
        <ServerCard server={server} />
      </CardContent>
    </Card>
  );
};
