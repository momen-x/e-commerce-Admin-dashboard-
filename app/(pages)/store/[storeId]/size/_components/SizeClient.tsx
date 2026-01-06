"use client";

import { Button } from "@/components/ui/button";
import { Size } from "@prisma/client";
import { Plus, Loader2, AlertCircle, Eye, Pencil } from "lucide-react";
import Link from "next/link";
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
import { useGetSizes } from "@/Hooks/useSize";
import { useRouter } from "next/navigation";
import DeleteBtn from "../[sizeId]/edit/_components/deleteBtn";

// Define your columns
const createColumns = (storeId: string): ColumnDef<Size>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("value")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const size = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/store/${storeId}/size/${size.id}`}>
            <Button variant="ghost" size="sm" title="View">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/store/${storeId}/size/${size.id}/edit`}>
            <Button variant="ghost" size="sm" title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteBtn sizeId={size.id} storeId={storeId} />
        </div>
      );
    },
  },
];

const SizeClient = () => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: sizes, isLoading, error } = useGetSizes(storeId!);
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

  const columns = storeId ? createColumns(storeId) : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: sizes || [],
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
            <span className="text-gray-400">Loading sizes...</span>
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
              Please select a store from the dashboard to manage sizes.
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
              Size table ({sizes?.length})
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your store sizes
            </p>
          </div>
          <Link href={`size/new`} className="shrink-0">
            <Button className="flex items-center gap-2" disabled={!storeId}>
              <Plus className="h-4 w-4" />
              Add New size
            </Button>
          </Link>
        </div>

        {/* Table or Empty State */}
        {sizes?.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-lg mb-1">No sizes yet</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get started by creating your first size.
            </p>
            <Link href={`size/new`}>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create size
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search sizes..."
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

export default SizeClient;
