export default function InfoRow(props) {
  return (
    <div className="flex flex-col p-2">
      <span className="text-xs">{props.label}:</span>
      <span className="font-semibold text-lg" style={props.style}>
        {props.value || "—"}
      </span>
    </div>
  );
}
