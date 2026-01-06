"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@prisma/client";
import {  Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useGetOrders } from "@/Hooks/useOrder";
import { useRouter } from "next/navigation";

// Define your columns
const createColumns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div
        className={`h-18 w-18`}
        style={{ background: row.getValue("phone") }}
      ></div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const date = new Date(row.getValue("address"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "isPaid",
    header: "Is Paid",
    cell: ({ row }) => {
      const date = new Date(row.getValue("isPaid"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
];

const OrderClient = () => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: orders, isLoading, error } = useGetOrders(storeId!);
  const router = useRouter();
  useEffect(() => {
    const initializeStore = () => {
      try {
        const storedStore = localStorage.getItem("store");
        if (storedStore) {
          const store = JSON.parse(storedStore);
          setStoreId(store.id);
          return store.id;
        }
        return null;
      } catch (err) {
        console.error("Error parsing store from localStorage:", err);
        toast.error("Failed to load store data");
        return null;
      }
    };
    const id = initializeStore();
    setStoreId(id);
  }, []);

  const columns = storeId ? createColumns() : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="w-[90vw] m-auto">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="text-gray-400">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="w-[90vw] m-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-600 text-sm mb-3">{error.message}</p>
            {storeId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.refresh()}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="mt-12">
        <div className="w-[90vw] m-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">No Store Selected</h3>
            </div>
            <p className="text-yellow-600 text-sm">
              Please select a store from the dashboard to manage orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="w-full m-auto flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl">
              order ({orders?.length})
            </h1>
          </div>
        </div>

        {/* Table or Empty State */}
        {orders?.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            </div>
            <h3 className="font-medium text-lg mb-1">No orders yet</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search orders..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
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
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderClient;
