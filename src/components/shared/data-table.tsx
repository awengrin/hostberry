"use client";

import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  emptyMessage = "Žiadne dáta",
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-[var(--muted-foreground)]">
        Načítavam...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[var(--muted-foreground)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "border-b border-[var(--border)] last:border-0",
                  onRowClick && "cursor-pointer hover:bg-[var(--accent)]"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render
                      ? col.render(item)
                      : String(item[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
