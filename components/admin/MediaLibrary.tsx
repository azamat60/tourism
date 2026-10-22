"use client";
import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";
type Media = { id: string; name: string; url: string };
export default function MediaLibrary() {
  const [files, setFiles] = useState<Media[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function load() {
    const response = await fetch("/api/admin/media/");
    if (response.ok) setFiles(await response.json());
  }
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) void load();
    });
    return () => {
      active = false;
    };
  }, []);
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPending(true);
    setMessage("");
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/media/", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await load();
      setMessage("Файл загружен. Скопируйте ссылку в нужное поле редактора.");
    } catch (failure) {
      setMessage(
        failure instanceof Error ? failure.message : "Ошибка загрузки",
      );
    } finally {
      setPending(false);
      event.target.value = "";
    }
  }
  return (
    <>
      <div className="admin-media-drop">
        <span className="admin-media-symbol">↑</span>
        <h2>Добавьте фотографии путешествия</h2>
        <p>JPG, PNG, WebP или PDF · до 10 МБ</p>
        <label className="admin-primary">
          {pending ? "Загружаю…" : "Выбрать файл"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            disabled={pending}
            onChange={upload}
            hidden
          />
        </label>
      </div>
      {message && (
        <p role="status" className="admin-hint">
          {message}
        </p>
      )}
      <div className="admin-media-grid">
        {files.map((file) => (
          <article key={file.id}>
            {file.name.endsWith(".pdf") ? (
              <a href={file.url} target="_blank" rel="noreferrer">
                PDF ↗
              </a>
            ) : (
              <Image
                src={file.url}
                alt={file.name}
                width={500}
                height={320}
                unoptimized
              />
            )}
            <small>{file.name}</small>
            <input
              aria-label={`Ссылка ${file.name}`}
              readOnly
              value={file.url}
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              className="admin-subtle"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(file.url);
                  setMessage("Ссылка скопирована.");
                } catch {
                  setMessage("Выделите и скопируйте ссылку из поля.");
                }
              }}
            >
              Копировать ссылку
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
