import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [companies, contracts, transactions] = await Promise.all([
    supabase.from("companies").select("*").order("created_at"),
    supabase.from("contracts").select("*").order("created_at"),
    supabase.from("bank_transactions").select("*").order("created_at"),
  ]);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto flex flex-col gap-10">
        <Section title="Companies" result={companies} />
        <Section title="Contracts" result={contracts} />
        <Section title="Bank transactions" result={transactions} />
      </div>
    </main>
  );
}

type QueryResult = {
  data: Record<string, unknown>[] | null;
  error: { message: string } | null;
};

function Section({ title, result }: { title: string; result: QueryResult }) {
  const { data, error } = result;

  return (
    <section className="flex flex-col gap-3">
      <h2>
        {title} ({data?.length ?? 0})
      </h2>

      {error ? (
        <p>Error: {error.message}</p>
      ) : !data || data.length === 0 ? (
        <p>No rows returned.</p>
      ) : (
        <div className="overflow-x-auto border">
          <table className="w-full text-left">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="p-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t">
                  {Object.values(row).map((value, j) => (
                    <td key={j} className="p-2">
                      {value === null ? <span>—</span> : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
