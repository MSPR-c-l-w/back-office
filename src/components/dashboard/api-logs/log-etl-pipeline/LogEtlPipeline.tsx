import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentLogType } from "../mocks"
import { LogEtlCard } from "./LogEtlCard"

interface Props {
    recentLogs: RecentLogType[]
}

export const LogEtlPipeline = ({ recentLogs }: Props) => {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Logs d&apos;Erreurs du Pipeline ETL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <LogEtlCard key={log.id} log={log} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
}