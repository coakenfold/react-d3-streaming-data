import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { getSineData } from "../SineChart/SineChartDataService";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SineDatumInterface } from "../SineChart/SineChartInterfaces";
import { replaceLog } from "../SineChart/sineCoordinates";
import { TablePagination } from "./TablePagination";

const columnHelper = createColumnHelper<SineDatumInterface>();
const columns = [
  columnHelper.accessor("timestamp", {
    cell: (info) =>
      new Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date(info.getValue())),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("x", {
    header: () => <span>X</span>,
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("y", {
    header: () => <span>Y</span>,
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
];

export const Table = () => {
  // Redux
  const dispatch = useDispatch();
  const log = useSelector((state: RootState) => state.sineCoordinates.log);

  // Log
  useEffect(() => {
    console.log("this should only run on mount");
    const fetchData = async () => {
      const data = await getSineData();
      dispatch(replaceLog(data));
    };
    fetchData();
  }, [dispatch]);

  const rerender = async () => {
    const data = await getSineData();
    dispatch(replaceLog(data));
  };
  const table = useReactTable({
    data: log,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-2">
      <button onClick={() => rerender()} className="border p-2">
        Get latest data
      </button>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      {table !== undefined ? <TablePagination table={table} /> : <></>}
    </div>
  );
};
