import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationMeta } from "@/graphql/generated";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  pagination?: {
    meta?: PaginationMeta;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (limit: number) => void;
    pageSizeOptions?: number[];
  };
};

function getPaginationItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages]);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  });

  return items;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found.",
  toolbar,
  pagination,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
  const meta = pagination?.meta;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const pageSizeOptions = pagination?.pageSizeOptions ?? [10, 25, 50, 100];
  const paginationItems = meta
    ? getPaginationItems(meta.page, totalPages)
    : [];

  return (
    <div className="space-y-3">
      {toolbar ? <div className="flex flex-col gap-2 sm:flex-row">{toolbar}</div> : null}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  Loading data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && pagination ? (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <div>
            Showing page {meta.page} of {totalPages} · {meta.totalCount} total
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {pagination.onPageSizeChange ? (
              <label className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 text-foreground"
                  disabled={isLoading}
                  onChange={(event) =>
                    pagination.onPageSizeChange?.(Number(event.target.value))
                  }
                  value={meta.limit}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="flex flex-wrap items-center gap-1">
              <Button
                disabled={!meta.hasPrevPage || isLoading}
                onClick={() => pagination.onPageChange(meta.page - 1)}
                size="icon-sm"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {paginationItems.map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    className="flex h-8 min-w-8 items-center justify-center px-2"
                    key={`ellipsis-${index}`}
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    disabled={isLoading}
                    key={item}
                    onClick={() => pagination.onPageChange(item)}
                    size="icon-sm"
                    variant={item === meta.page ? "default" : "outline"}
                  >
                    {item}
                  </Button>
                ),
              )}

              <Button
                disabled={!meta.hasNextPage || isLoading}
                onClick={() => pagination.onPageChange(meta.page + 1)}
                size="icon-sm"
                variant="outline"
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
