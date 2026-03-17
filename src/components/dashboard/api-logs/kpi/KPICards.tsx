import { KPICard } from "../types";
import { KpiCard } from "./KPICard";

interface Props {
  kpiCards: KPICard[];
}

export const KPICards = ({ kpiCards }: Props) => {
  return (
    <section aria-labelledby="api-kpis">
      <h3 id="api-kpis" className="sr-only">
        Indicateurs clés de l&apos;API
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          return <KpiCard key={kpi.label} kpi={kpi} />;
        })}
      </div>
    </section>
  );
};
