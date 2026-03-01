import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AlertType } from "./mocks";

interface Props {
  alert: AlertType;
}

export const AlertCard = ({ alert }: Props) => {
  return (
    <li
      key={alert.id}
      className="flex items-start gap-3 p-4 rounded-lg border"
      style={{
        borderColor:
          alert.type === "error"
            ? "#FF887B"
            : alert.type === "warning"
              ? "#FFB88C"
              : "#5CC58C",
        backgroundColor:
          alert.type === "error"
            ? "#FF887B10"
            : alert.type === "warning"
              ? "#FFB88C10"
              : "#5CC58C10",
      }}
    >
      {alert.type === "error" && (
        <XCircle
          className="w-5 h-5 text-[#FF887B] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      )}
      {alert.type === "warning" && (
        <AlertTriangle
          className="w-5 h-5 text-[#FFB88C] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      )}
      {alert.type === "success" && (
        <CheckCircle
          className="w-5 h-5 text-[#5CC58C] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      )}
      <div className="flex-1">
        <p className="text-sm text-[#4A5568] font-medium">{alert.message}</p>
        <p className="text-xs text-[#4A5568] opacity-70 mt-1">{alert.time}</p>
      </div>
    </li>
  );
};
