'use client';

import { useState, useMemo, type ReactNode, Fragment } from 'react';
import { ChevronDown, ChevronUp, Search, ChevronRight } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  expandableRender?: (row: T) => ReactNode;
  controls?: boolean;
  dateValue?: (row: T) => string;
};

export function DataTable<T>({ columns, data, keyExtractor, expandableRender, controls = true, dateValue }: DataTableProps<T>) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredData = useMemo(() => {
    const dateFiltered = dateValue ? data.filter((row) => {
      const date = dateValue(row);
      return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
    }) : data;
    if (!search.trim()) return dateFiltered;
    const lower = search.toLowerCase();
    return dateFiltered.filter((row) =>
      columns.some((col) => {
        const val = col.sortValue?.(row) ?? '';
        return String(val).toLowerCase().includes(lower);
      }),
    );
  }, [data, search, columns, dateValue, fromDate, toDate]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = col.sortValue!(a);
      const bVal = col.sortValue!(b);
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortAsc, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = sortedData.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      {controls ? <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--text-muted)]">{t('common.showEntries')}</span>
          <select
            aria-label={t('common.showEntries')}
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-[var(--text-muted)]">{t('common.entries')}</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {dateValue ? <>
            <Input type="date" aria-label="From date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="w-full sm:w-36" />
            <Input type="date" aria-label="To date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="w-full sm:w-36" />
          </> : null}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={t('common.search')}
            className="w-full pl-9 sm:w-72"
          />
        </div>
        </div>
      </div> : null}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-body)]">
              {expandableRender && <th className="w-10 px-4 py-3" />}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--text-muted)]"
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="-mx-2 -my-1 flex cursor-pointer items-center gap-1 px-2 py-1 select-none hover:text-[var(--text-primary)]"
                    >
                      {col.label}
                      {sortKey === col.key && (
                        sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">{col.label}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (expandableRender ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="mx-auto max-w-xs">
                    <p className="text-sm font-medium text-[var(--text-primary)]">No records found</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Try changing the search, filter, or page size.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rowId = keyExtractor(row);
                const isExpanded = expandedRows.has(rowId);
                return (
                  <Fragment key={rowId}>
                    <tr
                      className="border-b border-[var(--border-subtle)] last:border-0 transition-colors duration-150 hover:bg-[var(--bg-action-hover)]"
                    >
                      {expandableRender && (
                        <td className="w-10 px-4 py-3 align-middle">
                          <button
                            type="button"
                            onClick={() => toggleRow(rowId)}
                            aria-label={isExpanded ? 'Hide details' : 'Show details'}
                            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[var(--text-muted)] hover:bg-[var(--bg-action-hover)] hover:text-[var(--text-primary)] transition cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 align-middle">
                          {col.render(row)}
                        </td>
                      ))}
                    </tr>
                    {expandableRender && isExpanded && (
                      <tr className="bg-[var(--bg-body)]/20 border-b border-[var(--border-subtle)]">
                        <td colSpan={columns.length + 1} className="p-0">
                          <div className="px-6 py-4 bg-[var(--bg-body)]/10 border-l-2 border-[var(--text-primary)] animate-fade-in">
                            {expandableRender(row)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t('common.showing')} {sortedData.length === 0 ? 0 : (currentPage - 1) * perPage + 1} {t('common.to')}{' '}
          {Math.min(currentPage * perPage, sortedData.length)} {t('common.of')} {sortedData.length}
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            {t('common.previous')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
