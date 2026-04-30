const StatCard = ({ title, value }) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
  </div>
);

export default StatCard;
