"use client";

import Link from "next/link";

import { useStatusListQuery } from "@/features/status/hooks/useStatus";

export function StatusListTable() {
  const statusListQuery = useStatusListQuery();

  if (statusListQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (statusListQuery.isError) {
    return <p>Could not load status list.</p>;
  }

  const items = statusListQuery.data ?? [];

  return (
    <div>
      <p>
        <Link href="/status/create" className="sa-button">
          New
        </Link>
      </p>

      <table className="sa-table">
        <thead>
          <tr>
            <th>Value</th>
            <th>Description</th>
            <th>Time stamp</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id ?? `${item.value}-${item.description ?? ""}-${item.timeStamp}`}>
              <td>{item.value}</td>
              <td>{item.description}</td>
              <td>{new Date(item.timeStamp).toLocaleString()}</td>
              <td className="sa-actions">
                {item.id ? (
                  <>
                    <Link href={`/status/edit/${item.id}`} className="sa-button sa-button-ghost">
                      Edit
                    </Link>
                    <Link href={`/status/delete/${item.id}`} className="sa-button sa-button-danger">
                      Delete
                    </Link>
                  </>
                ) : (
                  <span>Unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
