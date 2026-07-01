type AlertType = "success" | "warning" | "error";

type AlertMessageProps = {
  message?: string;
  type?: AlertType;
};

export function AlertMessage({ message, type = "warning" }: AlertMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div role="alert" className="sa-alert" data-type={type}>
      {message}
    </div>
  );
}
