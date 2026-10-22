"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { browserSupabase } from "@/lib/supabase/client";
export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const credentials = {
      email: String(form.get("email")),
      password: String(form.get("password")),
    };
    try {
      const client = browserSupabase();
      const result =
        mode === "login"
          ? await client.auth.signInWithPassword(credentials)
          : await client.auth.signUp({
              ...credentials,
              options: {
                emailRedirectTo: window.location.origin + "/auth/callback/",
              },
            });
      if (result.error) throw result.error;
      if (!result.data.session) {
        setNotice(
          "Подтвердите email по ссылке из письма Supabase, затем войдите.",
        );
        return;
      }
      const { data: role, error: roleError } =
        await client.rpc("tourism_staff_role");
      if (roleError || !role) {
        await client.auth.signOut();
        setError(
          "Аккаунт не имеет доступа к панели. Обратитесь к администратору.",
        );
        return;
      }
      router.push("/admin/");
      router.refresh();
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Не удалось войти.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="admin-login">
      <Link href="/" className="admin-login-brand">
        <span className="admin-brand-mark">N</span> NOMAD DISCOVERY TOURS
      </Link>
      <div className="admin-login-card">
        <span className="admin-eyebrow">TOURISM / BACK OFFICE</span>
        <h1>
          Всё путешествие.
          <br />
          <em>Под контролем.</em>
        </h1>
        <p>Туры, выезды и гости — в одном месте.</p>
        <div className="admin-mode">
          <button
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Войти
          </button>
          <button
            type="button"
            aria-pressed={mode === "signup"}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Первый вход
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="you@company.com"
            />
          </label>
          <label>
            Пароль
            <input
              name="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={10}
              maxLength={128}
              required
            />
          </label>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="admin-success" role="status">
              {notice}
            </p>
          )}
          <button className="admin-primary" disabled={pending}>
            {pending
              ? "Подождите…"
              : mode === "login"
                ? "Войти в панель"
                : "Создать аккаунт сотрудника"}
          </button>
        </form>
        <p className="admin-fine">
          Первый вход: создайте аккаунт с назначенным email. Доступ выдаётся
          администратором.
        </p>
        <Link href="/">Вернуться на сайт ↗</Link>
      </div>
      <p className="admin-login-foot">LOCAL KNOWLEDGE. WIDE HORIZONS.</p>
    </main>
  );
}
