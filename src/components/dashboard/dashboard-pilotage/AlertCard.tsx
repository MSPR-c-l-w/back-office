import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AlertType } from "./mocks";

interface Props {
  alert: AlertType;
}

export const AlertCard = ({ alert }: Props) => {
  const severityLabel =
    alert.type === "error"
      ? "Erreur"
      : alert.type === "warning"
        ? "Avertissement"
        : "Succès";

  return (
    <li
      key={alert.id}
      className="flex items-start gap-3 p-4 rounded-lg border"
      style={{
        borderColor:
          alert.type === "error"
            ? "#DC2626"
            : alert.type === "warning"
              ? "#B45309"
              : "#166534",
        backgroundColor:
          alert.type === "error"
            ? "#FEE2E2"
            : alert.type === "warning"
              ? "#FEF3C7"
              : "#DCFCE7",
      }}
    >
      {alert.type === "error" && (
        <XCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]"
          aria-hidden="true"
        />
      )}
      {alert.type === "warning" && (
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]"
          aria-hidden="true"
        />
      )}
      {alert.type === "success" && (
        <CheckCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-[#166534]"
          aria-hidden="true"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1F2937]">
          <span className="sr-only">{severityLabel}: </span>
          {alert.message}
        </p>
        <p className="mt-1 text-xs text-[#475569]">{alert.time}</p>
      </div>
    </li>
  );
};
