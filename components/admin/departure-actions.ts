import type { ContentEntry } from "@/lib/site-types";

export function departureLabel(entry: ContentEntry) {
  return `${String(entry.data.tourName || entry.slug)} (${String(entry.data.startDate || "").slice(0, 10)})`;
}

export async function deleteDepartures(entries: ContentEntry[]) {
  const deleted: string[] = [];
  const failed: { id: string; label: string; error: string }[] = [];
  for (let offset = 0; offset < entries.length; offset += 4) {
    await Promise.all(
      entries.slice(offset, offset + 4).map(async (entry) => {
        try {
          const response = await fetch("/api/admin/content/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: entry.id, version: entry.version }),
          });
          const result = await response.json();
          if (!response.ok) {
            const message =
              response.status === 401
                ? "Сессия истекла. Войдите снова."
                : response.status === 403
                  ? "Недостаточно прав для удаления."
                  : result.error === "CONFLICT"
                    ? "Запись изменена или удалена. Обновите список."
                    : result.error || "Не удалось удалить выезд.";
            throw new Error(message);
          }
          deleted.push(entry.id);
        } catch (failure) {
          failed.push({
            id: entry.id,
            label: departureLabel(entry),
            error:
              failure instanceof Error
                ? failure.message
                : "Ошибка соединения. Повторите попытку.",
          });
        }
      }),
    );
  }
  return { deleted, failed };
}
