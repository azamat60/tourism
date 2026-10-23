"use client";
import Image from "../SiteImage";
import { useState } from "react";
import { STATUS_LABEL } from "./admin.constants";
export type Operation = {
  id: string;
  data?: Record<string, string>;
  form?: {
    travelers: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      signature?: string;
      guardianSignature?: string;
      [key: string]: unknown;
    }[];
    specialRequests: string;
  };
  receipt?: {
    tourTitle: string;
    start: string;
    quote: { subtotal: number; deposit: number };
  };
  status: string;
  payment_status?: string;
  notes: string;
  version: number;
  created_at: string;
  waiver_version?: string;
};
export default function Operations({
  records,
  type,
  onSaved,
}: {
  records: Operation[];
  type: "inquiries" | "bookings";
  onSaved: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Operation | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const statuses =
    type === "inquiries"
      ? ["new", "in_progress", "closed"]
      : ["pending", "confirmed", "cancelled", "completed"];
  const filtered = records.filter(
    (item) =>
      (!filter || item.status === filter) &&
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
  );
  async function save() {
    if (!selected) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/operations/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: type,
          id: selected.id,
          version: selected.version,
          status: selected.status,
          notes: selected.notes,
          payment_status: selected.payment_status,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          response.status === 409
            ? "Запись уже изменена. Обновите список."
            : data.error,
        );
      setSelected(null);
      onSaved();
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Ошибка сохранения",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <div className="admin-list-controls">
        <input
          type="search"
          aria-label="Поиск заявок"
          placeholder="Имя, email, тур…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          aria-label="Фильтр статуса"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="">Все статусы</option>
          {statuses.map((status) => (
            <option value={status} key={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Гость</th>
              <th>Путешествие</th>
              <th>Получено</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const lead = item.form?.travelers[0];
              return (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {item.data?.name ||
                        `${lead?.firstName} ${lead?.lastName}`}
                    </strong>
                    <small>{item.data?.email || lead?.email}</small>
                  </td>
                  <td>
                    {item.data?.tour || item.receipt?.tourTitle}
                    <small>{item.data?.date || item.receipt?.start}</small>
                  </td>
                  <td>
                    {new Date(item.created_at).toLocaleDateString("ru-RU", {
                      timeZone: "Asia/Bishkek",
                    })}
                  </td>
                  <td>
                    <span className={`admin-badge ${item.status}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-subtle"
                      onClick={() => {
                        setSelected(item);
                        setError("");
                      }}
                    >
                      Открыть ↗
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="admin-empty">
            <h3>Пока пусто</h3>
            <p>
              {records.length
                ? "Попробуйте другой поиск."
                : "Новые обращения с сайта появятся здесь."}
            </p>
          </div>
        )}
      </div>
      {selected && (
        <div
          className="admin-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="operation-title"
        >
          <section className="admin-editor">
            <header>
              <div>
                <span className="admin-eyebrow">
                  {type === "bookings" ? "БРОНИРОВАНИЕ" : "ЗАЯВКА"}
                </span>
                <h2 id="operation-title">
                  {selected.data?.name || selected.receipt?.tourTitle}
                </h2>
              </div>
              <button
                className="admin-close"
                aria-label="Закрыть"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </header>
            <div className="admin-editor-body">
              <div className="admin-field-grid">
                <label className="admin-field">
                  Статус
                  <select
                    value={selected.status}
                    onChange={(event) =>
                      setSelected({ ...selected, status: event.target.value })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </label>
                {type === "bookings" && (
                  <label className="admin-field">
                    Депозит
                    <select
                      value={selected.payment_status}
                      onChange={(event) =>
                        setSelected({
                          ...selected,
                          payment_status: event.target.value,
                        })
                      }
                    >
                      {["unpaid", "partial", "paid"].map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              {selected.status === "cancelled" && (
                <p className="admin-hint">
                  Отмена освобождает места. Повторное открытие отменённой брони
                  недоступно.
                </p>
              )}
              {selected.receipt && (
                <div className="admin-operation-summary">
                  <span>{selected.receipt.start}</span>
                  <strong>${selected.receipt.quote.subtotal.toFixed(2)}</strong>
                  <span>
                    Депозит: ${selected.receipt.quote.deposit.toFixed(2)}
                  </span>
                </div>
              )}
              {selected.data && (
                <dl className="admin-details">
                  {Object.entries(selected.data).map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {selected.form?.travelers.map((traveler, index) => (
                <details
                  className="admin-field-group"
                  key={index}
                  open={index === 0}
                >
                  <summary>
                    {index + 1}. {traveler.firstName} {traveler.lastName}
                  </summary>
                  <dl className="admin-details">
                    {Object.entries(traveler)
                      .filter(([key]) => !key.includes("ignature"))
                      .map(([key, value]) => (
                        <div key={key}>
                          <dt>{key}</dt>
                          <dd>
                            {Array.isArray(value)
                              ? value.join(", ")
                              : String(value)}
                          </dd>
                        </div>
                      ))}
                  </dl>
                  {traveler.signature && (
                    <Image
                      className="admin-signature"
                      src={traveler.signature}
                      alt="Подпись туриста"
                      width={600}
                      height={150}
                      unoptimized
                    />
                  )}
                  {traveler.guardianSignature && (
                    <Image
                      className="admin-signature"
                      src={traveler.guardianSignature}
                      alt="Подпись опекуна"
                      width={600}
                      height={150}
                      unoptimized
                    />
                  )}
                </details>
              ))}
              {selected.form && <p>{selected.form.specialRequests}</p>}
              {selected.waiver_version && (
                <p className="admin-hint">
                  Соглашение: {selected.waiver_version}
                </p>
              )}
              <label className="admin-field">
                Заметки менеджера
                <textarea
                  rows={5}
                  value={selected.notes}
                  onChange={(event) =>
                    setSelected({ ...selected, notes: event.target.value })
                  }
                />
              </label>
            </div>
            <footer>
              {error && (
                <p className="admin-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="admin-primary"
                disabled={pending}
                onClick={save}
              >
                {pending ? "Сохраняю…" : "Сохранить"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
