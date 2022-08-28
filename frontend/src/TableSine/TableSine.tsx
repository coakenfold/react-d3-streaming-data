import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../state";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { getSineData } from "../SineCoordinates/SineCoordinatesDataService";
import { replaceLog } from "../SineCoordinates/SineCoordinatesState";
import type { iSineDatum } from "../SineCoordinates/SineCoordinatesInterfaces";

const columnHelper = createColumnHelper<iSineDatum>();
const columns = [
  columnHelper.accessor("timestamp", {
    header: () => <span>Timestamp</span>,
    cell: (info) =>
      new Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date(info.getValue())),
    footer: () => <span>Timestamp</span>,
  }),
  columnHelper.accessor("x", {
    header: () => <span>X</span>,
    cell: (info) => info.renderValue(),
    footer: () => <span>X</span>,
  }),
  columnHelper.accessor("y", {
    header: () => <span>Y</span>,
    cell: (info) => info.renderValue(),
    footer: () => <span>Y</span>,
  }),
];

export const TableSine = () => {
  // Redux
  const dispatch = useDispatch();
  const log = useSelector((state: RootState) => state.sineCoordinates.log);

  // Log
  useEffect(() => {
    const fetchData = async () => {
      const { ok, data } = await getSineData();
      if (ok) {
        dispatch(replaceLog(data));
      }
    };
    fetchData();
  }, [dispatch]);

  const rerender = async () => {
    const { ok, data } = await getSineData();
    if (ok) {
      dispatch(replaceLog(data));
    }
  };
  const table = useReactTable({
    data: log,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="TableSine">
      <Row className="mb-3">
        <Col className="my-1" xs="auto">
          <Button variant="outline-primary" onClick={() => rerender()}>
            Get latest data
          </Button>
        </Col>
        <Col className="my-1" xs="auto">
          <Pagination className="my-0">
            <Pagination.First
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            />
            <Pagination.Prev
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />

            <Pagination.Item disabled>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </Pagination.Item>
            <Pagination.Next
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
            <Pagination.Last
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            />
          </Pagination>
        </Col>
        <Col className="my-1" xs="auto">
          <Form.Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col className="my-1" md="5">
          <div className="d-flex align-items-center">
            <div className="mr-2">Page&nbsp;</div>
            <form className="form-inline">
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded"
              />
            </form>
          </div>
        </Col>
      </Row>
      <Row>
        <table className="table table-striped table-sm">
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
      </Row>

      <Row className="mt-3">
        <Col className="my-1" xs="auto">
          <Pagination className="my-0">
            <Pagination.First
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            />
            <Pagination.Prev
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />

            <Pagination.Item disabled>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </Pagination.Item>
            <Pagination.Next
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
            <Pagination.Last
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            />
          </Pagination>
        </Col>
        <Col className="my-1" xs="auto" md={4}>
          <Form.Select
            className="my-0"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col className="my-1" md="5">
          <div className="d-flex align-items-center">
            <div className="mr-2">Page&nbsp;</div>
            <form className="form-inline">
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded"
              />
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};
