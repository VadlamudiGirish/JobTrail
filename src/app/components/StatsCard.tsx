interface Props {
  label: string;
  count: number;
}

export default function StatsCard({ label, count }: Props) {
  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col items-center">
      <span className="text-gray-500">{label}</span>
      <span className="mt-2 text-2xl font-semibold">{count}</span>
    </div>
  );
}
