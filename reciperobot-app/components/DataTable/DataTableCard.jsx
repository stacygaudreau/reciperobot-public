/*
    Table within a card panel which can have its data filtered and
    sorted by name, etc.
    Used for displaying a list of recipes, ingredients etc which
    the user can filter and sort through.
*/

'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/shadui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/shadui/table';
import { Badge } from '@/components/shadui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/shadui/dropdown-menu';
import { Input } from '@/components/shadui/input';
import { Button } from '@/components/shadui/button';
import { MoreHorizontal, PlusCircle, File } from 'lucide-react';
import Image from 'next/image';

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';

import DataTablePagination from '@/components/DataTable/DataTablePagination';
import { capitalise } from '@/lib/utils';

const DataTableCard = ({
  data,
  columns,
  dataName = 'row',
  filterColumnKey = 'name',
  title = 'Title',
  subtitle = 'Subtitle of the data table card.',
  dataNewEntryFn = null,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <section className='flex flex-col w-full'>
          <div className='flex justify-between gap-4 py-3'>
            {/* left group */}
            <div>
              <Input
                placeholder={`Filter ${dataName}s...`}
                value={table.getColumn(filterColumnKey)?.getFilterValue() ?? ''}
                onChange={(event) =>
                  table
                    .getColumn(filterColumnKey)
                    ?.setFilterValue(event.target.value)
                }
                className='max-w-sm'
              />
            </div>
            {/* right group */}
            <div className='flex items-center gap-3'>
              <Button variant='outline' className='h-8 gap-1'>
                <File className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Export
                </span>
              </Button>
              <Button
                className='h-8 gap-1'
                onClick={() => {
                  dataNewEntryFn();
                }}
              >
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  New {capitalise(dataName)}
                </span>
              </Button>
            </div>
          </div>
          {/* data table */}
          <Card>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
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
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </section>
      </CardContent>
      <DataTablePagination table={table} dataName={dataName} />
    </Card>
  );
};

export default DataTableCard;