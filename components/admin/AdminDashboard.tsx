"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { ContentEntry, EntryKind, StaffRole } from "@/lib/site-types";
import { browserSupabase } from "@/lib/supabase/client";
import ContentEditor from "./ContentEditor";
import Operations, { type Operation } from "./Operations";
import MediaLibrary from "./MediaLibrary";
import { KIND_LABEL } from "./admin.constants";
type Tab = "overview" | EntryKind | "inquiries" | "bookings" | "media";
const TABS: Record<Tab, string> = {
  overview: "Обзор",
  ...KIND_LABEL,
  inquiries: "Заявки",
  bookings: "Бронирования",
  media: "Медиатека",
};
const GLYPH: Record<Tab, string> = {
  overview: "◈",
  tour: "△",
  departure: "▦",
  inquiries: "↙",
  bookings: "☷",
  post: "▤",
  faq: "?",
  page: "▧",
  media: "▧",
  settings: "⚙",
};
function makeEntry(kind: EntryKind, entries: ContentEntry[]): ContentEntry {
  const id = crypto.randomUUID();
  const tour = entries.find((entry) => entry.kind === "tour");
  const start = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const end = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
  const templates: Partial<Record<EntryKind, Record<string, unknown>>> = {
    tour: {
      id,
      slug: "new-tour-" + id.slice(0, 6),
      title: "Новый тур",
      description: "",
      blurb: "",
      image: "",
      duration: "3 days",
      durationDays: 3,
      locations: [],
      country: "Kyrgyzstan",
      horse: true,
      active: true,
      pricesEnglish: { "1": 0, "2": 0 },
      defaultMaxPeople: 6,
      itinerary: [{ title: "День 1", notes: "", images: [] }],
      inclusions: [],
      exclusions: [],
      optionalAddOns: [],
      images: [],
    },
    departure: {
      id,
      tourSlug: tour?.slug || "",
      tourName: tour?.data.title || "",
      startDate: start + "T00:00:00+06:00",
      endDate: end + "T23:59:00+06:00",
      active: true,
      status: "active",
      peopleBooked: 0,
      maxPeople: 6,
      Prices: tour?.data.pricesEnglish || {},
    },
    post: {
      slug: "new-article-" + id.slice(0, 6),
      title: "Новая статья",
      summary: "",
      image: "",
      content: "",
    },
    faq: { question: "Новый вопрос", answer: "" },
  };
  const data = templates[kind] || {};
  return {
    id: kind === "departure" ? id : kind + ":" + id,
    kind,
    slug: String(data.slug || id),
    data,
    translations: {},
    published: false,
    version: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
export default function AdminDashboard({
  role,
  email,
  initialTab,
}: {
  role: StaffRole;
  email: string;
  initialTab?: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(
    initialTab && initialTab in TABS ? (initialTab as Tab) : "overview",
  );
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [operations, setOperations] = useState<{
    inquiries: Operation[];
    bookings: Operation[];
  }>({ inquiries: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<ContentEntry | null>(null);
  const [limit, setLimit] = useState(40);
  const contentAccess = role === "admin" || role === "editor";
  const operationsAccess = role === "admin" || role === "manager";
  const load = useCallback(async () => {
    try {
      const paths = [
        ...(contentAccess ? ["/api/admin/content/"] : []),
        ...(operationsAccess ? ["/api/admin/operations/"] : []),
      ];
      const results = await Promise.all(
        paths.map(async (path) => {
          const response = await fetch(path, { cache: "no-store" });
          if (response.status === 401) {
            router.push("/admin/login/");
            router.refresh();
            throw new Error("Сессия истекла");
          }
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          return { path, data };
        }),
      );
      results.forEach(({ path, data }) => {
        if (path.includes("content")) setEntries(data);
        else setOperations(data);
      });
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Не удалось загрузить данные.",
      );
    } finally {
      setLoading(false);
    }
  }, [contentAccess, operationsAccess, router]);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) void load();
    });
    return () => {
      active = false;
    };
  }, [load]);
  const navigate = (next: Tab) => {
    setTab(next);
    setSearch("");
    setLimit(40);
    setFilter("all");
    setNotice("");
    window.history.replaceState(null, "", `/admin/?tab=${next}`);
  };
  const kinds = entries.filter((entry) => entry.kind === tab);
  const filtered = kinds.filter(
    (entry) =>
      (filter === "all" || entry.published === (filter === "published")) &&
      JSON.stringify([
        entry.slug,
        entry.data.title,
        entry.data.question,
        entry.data.tourName,
        entry.data.startDate,
      ])
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const tours = entries.filter((entry) => entry.kind === "tour");
  const upcoming = entries
    .filter(
      (entry) =>
        entry.kind === "departure" &&
        entry.published &&
        String(entry.data.startDate).slice(0, 10) >=
          new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bishkek" }).format(
            new Date(),
          ),
    )
    .sort((a, b) =>
      String(a.data.startDate).localeCompare(String(b.data.startDate)),
    );
  const menu = (Object.keys(TABS) as Tab[]).filter(
    (item) =>
      item === "overview" ||
      (["inquiries", "bookings"].includes(item)
        ? operationsAccess
        : contentAccess),
  );
  async function logout() {
    await browserSupabase().auth.signOut();
    router.push("/admin/login/");
    router.refresh();
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin/" className="admin-brand">
          <span className="admin-brand-mark">N</span>
          <span>
            Nomad<small>DISCOVERY TOURS</small>
          </span>
        </Link>
        <span className="admin-sidebar-label">РАБОЧЕЕ ПРОСТРАНСТВО</span>
        <nav>
          {menu.map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => navigate(item)}
            >
              <span className="admin-nav-icon">{GLYPH[item]}</span>
              {TABS[item]}
              {item === "inquiries" &&
                operations.inquiries.filter((record) => record.status === "new")
                  .length > 0 && (
                  <b>
                    {
                      operations.inquiries.filter(
                        (record) => record.status === "new",
                      ).length
                    }
                  </b>
                )}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            Открыть сайт ↗
          </a>
          <div className="admin-user">
            <span>{email.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{email}</strong>
              <small>{role}</small>
            </div>
          </div>
          <button onClick={logout}>Выйти из аккаунта</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <span>
            TOURISM <b>/</b> {TABS[tab]}
          </span>
          <span className="admin-live">
            <i /> Supabase подключён
          </span>
        </header>
        <div className="admin-content">
          <div className="admin-heading">
            <div>
              <span className="admin-eyebrow">
                NOMAD DISCOVERY / УПРАВЛЕНИЕ
              </span>
              <h1>
                {tab === "overview"
                  ? "Хороший день для приключений."
                  : TABS[tab]}
              </h1>
              <p>
                {tab === "overview"
                  ? "Всё, что нужно для следующего путешествия."
                  : "Управляйте данными. Изменения появятся на сайте после сохранения."}
              </p>
            </div>
            <button
              className="admin-subtle"
              onClick={() => {
                setLoading(true);
                void load();
              }}
            >
              ↻ Обновить
            </button>
          </div>
          {error && (
            <div className="admin-error" role="alert">
              {error}
            </div>
          )}
          {notice && (
            <div className="admin-success" role="status">
              {notice}
            </div>
          )}
          {loading ? (
            <div className="admin-empty" role="status">
              Загружаю данные…
            </div>
          ) : (
            <>
              {tab === "overview" ? (
                <>
                  <div className="admin-stats">
                    {[
                      {
                        label: "Опубликовано туров",
                        value: tours.filter(
                          (item) => item.published && item.data.active,
                        ).length,
                        target: "tour",
                        hint: "Ваши маршруты",
                      },
                      {
                        label: "Ближайшие выезды",
                        value: upcoming.length,
                        target: "departure",
                        hint: "Впереди новые горизонты",
                      },
                      {
                        label: "Новые заявки",
                        value: operations.inquiries.filter(
                          (item) => item.status === "new",
                        ).length,
                        target: "inquiries",
                        hint: "Ожидают вашего ответа",
                      },
                      {
                        label: "Ожидают подтверждения",
                        value: operations.bookings.filter(
                          (item) => item.status === "pending",
                        ).length,
                        target: "bookings",
                        hint: "Планы будущих гостей",
                      },
                    ]
                      .filter((item) =>
                        ["tour", "departure"].includes(item.target)
                          ? contentAccess
                          : operationsAccess,
                      )
                      .map((item, index) => (
                        <button
                          className="admin-stat"
                          key={item.label}
                          onClick={() => navigate(item.target as Tab)}
                        >
                          <span>
                            {item.label}
                            <i>0{index + 1}</i>
                          </span>
                          <strong>{item.value}</strong>
                          <small>{item.hint} ↗</small>
                        </button>
                      ))}
                  </div>
                  <div className="admin-overview-grid">
                    <section className="admin-panel">
                      <div className="admin-panel-heading">
                        <h2>Следующие выезды</h2>
                        {contentAccess && (
                          <button onClick={() => navigate("departure")}>
                            Все выезды ↗
                          </button>
                        )}
                      </div>
                      {upcoming.slice(0, 6).map((entry) => (
                        <button
                          className="admin-departure"
                          key={entry.id}
                          onClick={() => setSelected(entry)}
                        >
                          <span className="admin-date-tile">
                            <strong>
                              {String(entry.data.startDate).slice(8, 10)}
                            </strong>
                            <small>
                              {new Date(
                                String(entry.data.startDate),
                              ).toLocaleDateString("ru-RU", {
                                month: "short",
                                timeZone: "Asia/Bishkek",
                              })}
                            </small>
                          </span>
                          <span>
                            <strong>{String(entry.data.tourName)}</strong>
                            <small>
                              {entry.data.peopleBooked as number} /{" "}
                              {entry.data.maxPeople as number} мест занято
                            </small>
                          </span>
                          <span className="admin-seat-track">
                            <i
                              style={{
                                width: `${(Number(entry.data.peopleBooked) / Number(entry.data.maxPeople)) * 100}%`,
                              }}
                            />
                          </span>
                          <span>↗</span>
                        </button>
                      ))}
                      {!upcoming.length && (
                        <div className="admin-empty">
                          Запланируйте первый выезд.
                        </div>
                      )}
                    </section>
                    <section className="admin-welcome">
                      <span className="admin-eyebrow">ВАШ СЛЕДУЮЩИЙ ШАГ</span>
                      <h2>
                        Меньше рутины.
                        <br />
                        <em>Больше путешествий.</em>
                      </h2>
                      <p>
                        Добавьте даты, проверьте новые заявки и подготовьте
                        гостей к дороге.
                      </p>
                      <button
                        className="admin-primary"
                        onClick={() =>
                          navigate(contentAccess ? "tour" : "inquiries")
                        }
                      >
                        {contentAccess ? "Управлять турами" : "Открыть заявки"}{" "}
                        ↗
                      </button>
                      <div className="admin-mountain">△</div>
                    </section>
                  </div>
                </>
              ) : tab === "media" ? (
                <MediaLibrary />
              ) : tab === "inquiries" || tab === "bookings" ? (
                <Operations
                  records={operations[tab]}
                  type={tab}
                  onSaved={() => {
                    setNotice("Изменения сохранены.");
                    void load();
                  }}
                />
              ) : (
                <>
                  <div className="admin-list-controls">
                    <input
                      type="search"
                      aria-label="Поиск контента"
                      placeholder="Название, маршрут или дата…"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setLimit(40);
                      }}
                    />
                    <select
                      aria-label="Публикация"
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                    >
                      <option value="all">Все записи</option>
                      <option value="published">Опубликованные</option>
                      <option value="draft">Черновики / архив</option>
                    </select>
                    {["tour", "departure", "post", "faq"].includes(tab) && (
                      <button
                        className="admin-primary"
                        onClick={() =>
                          setSelected(makeEntry(tab as EntryKind, entries))
                        }
                      >
                        + Добавить
                      </button>
                    )}
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{tab === "departure" ? "Выезд" : "Название"}</th>
                          <th>
                            {tab === "departure" ? "Места" : "Адрес / ключ"}
                          </th>
                          <th>Публикация</th>
                          <th>Обновлено</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.slice(0, limit).map((entry) => (
                          <tr key={entry.id}>
                            <td>
                              <strong>
                                {String(
                                  entry.data.title ||
                                    entry.data.question ||
                                    entry.data.tourName ||
                                    entry.slug,
                                )}
                              </strong>
                              {tab === "departure" && (
                                <small>
                                  {String(entry.data.startDate).slice(0, 10)} —{" "}
                                  {String(entry.data.endDate).slice(0, 10)}
                                </small>
                              )}
                            </td>
                            <td>
                              {tab === "departure" ? (
                                `${entry.data.peopleBooked} / ${entry.data.maxPeople}`
                              ) : (
                                <small>{entry.slug}</small>
                              )}
                            </td>
                            <td>
                              <span
                                className={`admin-badge ${entry.published ? "confirmed" : "closed"}`}
                              >
                                {entry.published
                                  ? "Опубликовано"
                                  : "Черновик / архив"}
                              </span>
                            </td>
                            <td>
                              {new Date(entry.updated_at).toLocaleDateString(
                                "ru-RU",
                                { timeZone: "Asia/Bishkek" },
                              )}
                            </td>
                            <td>
                              <button
                                className="admin-subtle"
                                onClick={() => setSelected(entry)}
                              >
                                Изменить ↗
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!filtered.length && (
                      <div className="admin-empty">
                        <h3>Записей не найдено</h3>
                        <p>Измените поиск или добавьте новую запись.</p>
                      </div>
                    )}
                  </div>
                  <div className="admin-list-footer">
                    <span>
                      {Math.min(limit, filtered.length)} из {filtered.length}{" "}
                      записей
                    </span>
                    {filtered.length > limit && (
                      <button
                        className="admin-subtle"
                        onClick={() => setLimit(limit + 40)}
                      >
                        Показать ещё
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <footer className="admin-page-footer">
          NOMAD DISCOVERY TOURS{" "}
          <span>Создавайте путешествия, которые остаются с людьми.</span>
        </footer>
      </main>
      {selected && (
        <ContentEditor
          key={selected.id}
          entry={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            setNotice("Сохранено. Данные сайта обновлены.");
            void load();
          }}
        />
      )}
    </div>
  );
}
