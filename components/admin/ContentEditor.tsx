"use client";
import { useState } from "react";
import type { ContentEntry } from "@/lib/site-types";
import FieldEditor, { type JsonValue } from "./FieldEditor";
import { LANGUAGE_LABEL } from "./admin.constants";
export default function ContentEditor({
  entry,
  onClose,
  onSaved,
  onDeleted,
}: {
  entry: ContentEntry;
  onClose: () => void;
  onSaved: (entry: ContentEntry) => void;
  onDeleted: (id: string) => void;
}) {
  const [draft, setDraft] = useState(entry);
  const [locale, setLocale] = useState("en");
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const value = (
    locale === "en"
      ? draft.data
      : draft.translations[locale as keyof typeof draft.translations] ||
        draft.data
  ) as JsonValue;
  const change = (next: JsonValue) => {
    setDirty(true);
    setDraft(
      locale === "en"
        ? { ...draft, data: next as Record<string, unknown> }
        : { ...draft, translations: { ...draft.translations, [locale]: next } },
    );
  };
  const close = () => {
    if (pending || deleting) return;
    if (
      !dirty ||
      window.confirm("Есть несохранённые изменения. Закрыть редактор?")
    )
      onClose();
  };
  async function remove() {
    const name = String(entry.data.tourName || entry.slug);
    const date = String(entry.data.startDate || "").slice(0, 10);
    if (
      !window.confirm(
        `Удалить выезд «${name}» (${date})? Восстановить запись будет невозможно.`,
      )
    )
      return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, version: entry.version }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error === "CONFLICT"
            ? "Запись уже изменена или удалена. Закройте редактор и обновите список."
            : result.error,
        );
      onDeleted(entry.id);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Не удалось удалить выезд.",
      );
    } finally {
      setDeleting(false);
    }
  }
  async function save() {
    setPending(true);
    setError("");
    try {
      const data = {
        ...draft,
        ...(draft.version === 0 && draft.data.slug
          ? { slug: String(draft.data.slug) }
          : {}),
      };
      const response = await fetch("/api/admin/content/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          response.status === 409
            ? "Запись уже изменена. Закройте редактор, обновите список и повторите правку."
            : result.error,
        );
      setDirty(false);
      onSaved(result);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Ошибка сохранения",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <div
      className="admin-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-title"
    >
      <section className="admin-editor">
        <header>
          <div>
            <span className="admin-eyebrow">
              РЕДАКТОР /{" "}
              {draft.version === 0 ? "НОВАЯ ЗАПИСЬ" : `ВЕРСИЯ ${draft.version}`}
            </span>
            <h2 id="editor-title">
              {String(
                draft.data.title ||
                  draft.data.question ||
                  draft.data.tourName ||
                  draft.slug,
              )}
            </h2>
          </div>
          <button
            type="button"
            className="admin-close"
            aria-label="Закрыть редактор"
            disabled={pending || deleting}
            onClick={close}
          >
            ×
          </button>
        </header>
        <div className="admin-editor-toolbar">
          <select
            aria-label="Язык содержимого"
            value={locale}
            onChange={(event) => setLocale(event.target.value)}
          >
            {Object.entries(LANGUAGE_LABEL).map(([key, label]) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              disabled={draft.kind === "settings" || draft.kind === "page"}
              checked={draft.published}
              onChange={(event) => {
                setDraft({ ...draft, published: event.target.checked });
                setDirty(true);
              }}
            />
            Опубликовано
          </label>
          <a href="/admin/?tab=media" target="_blank" rel="noreferrer">
            Медиатека ↗
          </a>
        </div>
        {locale !== "en" && (
          <p className="admin-hint">
            Перевод привязан к полям записи. Незаполненные поля используют
            исходное содержимое.
          </p>
        )}
        <div className="admin-editor-body">
          <FieldEditor
            translated={locale !== "en"}
            value={value}
            onChange={change}
            locked={["assets", "countries"].includes(draft.slug)}
          />
        </div>
        <footer>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <span>
            {dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}
          </span>
          {entry.kind === "departure" && entry.version > 0 && (
            <button
              type="button"
              className="admin-subtle admin-danger"
              disabled={pending || deleting}
              onClick={remove}
            >
              {deleting ? "Удаляю…" : "Удалить выезд"}
            </button>
          )}
          <button
            type="button"
            className="admin-subtle"
            disabled={pending || deleting}
            onClick={close}
          >
            Отмена
          </button>
          <button
            type="button"
            className="admin-primary"
            disabled={pending || deleting}
            onClick={save}
          >
            {pending ? "Сохраняю…" : "Сохранить изменения"}
          </button>
        </footer>
      </section>
    </div>
  );
}
