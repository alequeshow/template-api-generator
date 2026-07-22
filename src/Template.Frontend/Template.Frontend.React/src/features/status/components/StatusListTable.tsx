"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useDeleteStatusMutation, useStatusListQuery } from "@/features/status/hooks/useStatus";
import type { StatusItem } from "@/features/status/types";
import { Modal } from "@/shared/ui/Modal";

const PAGE_SIZE = 10;

type SortKey = "value" | "description" | "timeStamp";
type SortDir = "asc" | "desc";

type PageItem = { kind: "page"; page: number } | { kind: "ellipsis"; key: string };

function buildPageItems(totalPages: number, currentPage: number): PageItem[] {
  const pages: PageItem[] = [];
  let prev: number | null = null;

  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      if (prev !== null && p - prev > 1) {
        pages.push({ kind: "ellipsis", key: `ellipsis-${prev}-${p}` });
      }
      pages.push({ kind: "page", page: p });
      prev = p;
    }
  }

  return pages;
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  const active = column === sortKey;
  return (
    <span className="sa-sort-icon" data-active={active} aria-hidden="true">
      {active ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );
}

export function StatusListTable() {
  const statusListQuery = useStatusListQuery();
  const deleteMutation = useDeleteStatusMutation();

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("timeStamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [statusToDelete, setStatusToDelete] = useState<StatusItem>();
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    const items = statusListQuery.data ?? [];
    if (!search.trim()) return items;
    const lower = search.toLowerCase();
    return items.filter(
      (item) =>
        item.value.toLowerCase().includes(lower) ||
        (item.description ?? "").toLowerCase().includes(lower),
    );
  }, [statusListQuery.data, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "value") cmp = a.value.localeCompare(b.value);
      else if (sortKey === "description")
        cmp = (a.description ?? "").localeCompare(b.description ?? "");
      else if (sortKey === "timeStamp")
        cmp = new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (statusListQuery.isLoading) {
    return <p style={{ color: "var(--sa-text-muted)" }}>Loading...</p>;
  }

  if (statusListQuery.isError) {
    return <p style={{ color: "var(--sa-danger)" }}>Could not load status list.</p>;
  }

  return (
    <div>
      <div className="sa-table-controls">
        <div className="sa-table-search">
          <input
            type="search"
            placeholder="Search by value or description…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search status entries"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="sa-table-info">
            {sorted.length} {sorted.length === 1 ? "entry" : "entries"}
            {search ? ` (filtered from ${statusListQuery.data?.length ?? 0})` : ""}
          </span>
          <Link href="/status/create" className="sa-button sa-button-sm">
            + New
          </Link>
        </div>
      </div>

      <div className="sa-table-wrapper">
        <table className="sa-table">
          <thead>
            <tr>
              <th
                className="sa-sortable"
                onClick={() => handleSort("value")}
                aria-sort={sortKey === "value" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                Value <SortIcon column="value" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th
                className="sa-sortable"
                onClick={() => handleSort("description")}
                aria-sort={sortKey === "description" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                Description <SortIcon column="description" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th
                className="sa-sortable"
                onClick={() => handleSort("timeStamp")}
                aria-sort={sortKey === "timeStamp" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                Time stamp <SortIcon column="timeStamp" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--sa-text-muted)", padding: "1.5rem" }}>
                  {search ? "No entries match your search." : "No status entries yet."}
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr key={item.id ?? `${item.value}-${item.description ?? ""}-${item.timeStamp}`}>
                  <td>{item.value}</td>
                  <td>{item.description ?? <span style={{ color: "var(--sa-text-muted)" }}>—</span>}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(item.timeStamp).toLocaleString()}</td>
                  <td>
                    <div className="sa-actions">
                      {item.id ? (
                        <>
                          <Link href={`/status/edit/${item.id}`} className="sa-button sa-button-ghost sa-button-sm">
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="sa-button sa-button-danger sa-button-sm"
                            onClick={() => setStatusToDelete(item)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "var(--sa-text-muted)", fontSize: "0.8125rem" }}>N/A</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.875rem" }}>
          <nav className="sa-pagination" aria-label="Table pagination">
            <button
              type="button"
              className="sa-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
              aria-label="First page"
            >
              «
            </button>
            <button
              type="button"
              className="sa-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              ‹
            </button>
            {buildPageItems(totalPages, currentPage).map((item) =>
                item.kind === "ellipsis" ? (
                  <span
                    key={item.key}
                    className="sa-pagination-btn"
                    style={{ cursor: "default", border: "none", background: "transparent" }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item.page}
                    type="button"
                    className="sa-pagination-btn"
                    data-active={item.page === currentPage}
                    onClick={() => setPage(item.page)}
                    aria-label={`Page ${item.page}`}
                    aria-current={item.page === currentPage ? "page" : undefined}
                  >
                    {item.page}
                  </button>
                ),
              )}
            <button
              type="button"
              className="sa-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              ›
            </button>
            <button
              type="button"
              className="sa-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage(totalPages)}
              aria-label="Last page"
            >
              »
            </button>
          </nav>
        </div>
      ) : null}
      <Modal
        open={Boolean(statusToDelete)}
        variant="confirmation"
        title="Are you sure?"
        description={`Delete "${statusToDelete?.value ?? ""}"? This action cannot be undone.`}
        confirmLabel="Yes, delete it!"
        cancelLabel="Cancel"
        closePolicy={{ allowBackdropDismiss: true, allowEscapeDismiss: true }}
        onConfirm={async () => {
          if (!statusToDelete?.id) return;

          try {
            await deleteMutation.mutateAsync(statusToDelete.id);
            setStatusToDelete(undefined);
          } catch {
            setStatusToDelete(undefined);
            setShowDeleteErrorModal(true);
          }
        }}
        onCancel={() => setStatusToDelete(undefined)}
        onDismiss={() => setStatusToDelete(undefined)}
      />
      <Modal
        open={showDeleteErrorModal}
        variant="error"
        title="Could not delete status"
        description="The status entry could not be deleted. Please try again."
        onClose={() => setShowDeleteErrorModal(false)}
      />
    </div>
  );
}
