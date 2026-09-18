
export const BalanceCard = ({
  title,
  value,
  description,
  primary = false,
}: {
  title: string;
  value: string;
  description: string;
  primary?: boolean;
}) => {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        primary
          ? "border-blue-500/20 bg-blue-500/10"
          : "border-white/10 bg-white/3"
      }`}
    >
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-emerald-400">
        {description}
      </p>
    </div>
  );
}

export const QuickAction = ({
  icon,
  label,
}: {
  icon: string;
  label: string;
})=> {
  return (
    <button className="group rounded-2xl border border-white/10 bg-white/3 p-4 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <p className="text-sm font-medium">
        {label}
      </p>
    </button>
  );
}

export const AccountCard = ({
  name,
  number,
  balance,
}: {
  name: string;
  number: string;
  balance: string;
})=> {
  return (
    <div className="mb-3 rounded-xl border border-white/5 bg-black/20 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {number}
          </p>
        </div>

        <p className="text-sm font-semibold">
          {balance}
        </p>
      </div>
    </div>
  );
}

export const TransactionRow = ({
  name,
  category,
  amount,
  date,
}: {
  name: string;
  category: string;
  amount: number;
  date: string;
}) => {
  const isIncome = amount > 0;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
          {isIncome ? "↓" : "↑"}
        </div>

        <div>
          <p className="text-sm font-medium">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {category} · {date}
          </p>
        </div>
      </div>

      <p
        className={`text-sm font-medium ${
          isIncome
            ? "text-emerald-400"
            : "text-slate-300"
        }`}
      >
        {isIncome ? "+" : "-"}${
        Math.abs(amount).toLocaleString()}
      </p>
    </div>
  );
}