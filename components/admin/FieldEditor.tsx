'use client';
import { FIELD_LABEL, READ_ONLY } from './admin.constants';
export type JsonValue = null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };
type Props = {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  name?: string;
  path?: string;
  translated?: boolean;
  locked?: boolean;
};
function blank(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blank(item)]));
  if (typeof value === 'boolean') return false;
  if (typeof value === 'number') return 0;
  return '';
}
export default function FieldEditor({
  value,
  onChange,
  name = '',
  path = 'field',
  translated = false,
  locked = false,
}: Props) {
  const label = FIELD_LABEL[name] || name;
  const disabled = locked || READ_ONLY.has(name) || (translated && typeof value !== 'string');
  if (Array.isArray(value))
    return (
      <details className="admin-field-group" open={value.length < 3}>
        <summary>
          {label}
          <span>{value.length}</span>
        </summary>
        <div>
          {value.map((item, index) => (
            <div className="admin-array-row" key={index}>
              <FieldEditor
                value={item}
                onChange={(next) => onChange(value.map((current, i) => (i === index ? next : current)))}
                name={typeof item === 'object' ? String(index + 1) : ''}
                path={`${path}-${index}`}
                translated={translated}
                locked={locked || READ_ONLY.has(name)}
              />
              {!translated && !locked && !READ_ONLY.has(name) && (
                <button
                  type="button"
                  className="admin-remove"
                  aria-label={`Удалить ${label} ${index + 1}`}
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {!translated && !locked && !READ_ONLY.has(name) && (
            <button
              type="button"
              className="admin-subtle"
              onClick={() =>
                onChange([
                  ...value,
                  value.length
                    ? blank(value[0])
                    : name === 'itinerary'
                      ? { title: '', notes: '', images: [] }
                      : name === 'optionalAddOns'
                        ? {
                            name: '',
                            description: '',
                            cost: 0,
                            billing: 'flat',
                            scope: 'traveler',
                          }
                        : '',
                ])
              }
            >
              + Добавить
            </button>
          )}
        </div>
      </details>
    );
  if (value && typeof value === 'object')
    return (
      <details className="admin-field-group" open={path === 'field'}>
        <summary>{label || 'Содержание'}</summary>
        <div className="admin-field-grid">
          {Object.entries(value).map(([key, item]) => (
            <FieldEditor
              key={key}
              value={item}
              onChange={(next) => onChange({ ...value, [key]: next })}
              name={key}
              path={`${path}-${key}`}
              translated={translated}
              locked={locked || READ_ONLY.has(name)}
            />
          ))}
          {!translated &&
            !locked &&
            [
              'pricesEnglish',
              'pricesNonEnglish',
              'defaultDeposit',
              'Prices',
              'imageCaptions',
              'carouselOffsets',
            ].includes(name) && (
              <button
                type="button"
                className="admin-subtle"
                onClick={() => {
                  const key = window.prompt(
                    name === 'imageCaptions' || name === 'carouselOffsets'
                      ? 'Путь фотографии'
                      : 'Размер группы (число туристов)',
                  );
                  if (key && !Object.hasOwn(value, key))
                    onChange({ ...value, [key]: name === 'imageCaptions' ? '' : 0 });
                }}
              >
                + Добавить {name === 'imageCaptions' ? 'подпись' : 'тариф'}
              </button>
            )}
        </div>
      </details>
    );
  if (typeof value === 'string' && ['startDate', 'endDate'].includes(name)) {
    const date = new Date(value);
    const local = Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat('sv-SE', {
          timeZone: 'Asia/Bishkek',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23',
        })
          .format(date)
          .replace(' ', 'T')
      : '';
    return (
      <label className="admin-field" htmlFor={path}>
        {label} · Бишкек
        <input
          id={path}
          type="datetime-local"
          value={local}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value + ':00+06:00')}
        />
      </label>
    );
  }
  const choices: Record<string, Record<string, string>> = {
    scope: { traveler: 'На туриста', group: 'На группу' },
    billing: { flat: 'Фиксированно', perDay: 'За день' },
    chargeMode: { once: 'Однократно', perPerson: 'На человека' },
    status: { active: 'Активен', completed: 'Завершён', cancelled: 'Отменён' },
  };
  if (typeof value === 'string' && choices[name])
    return (
      <label className="admin-field" htmlFor={path}>
        {label}
        <select id={path} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
          {Object.entries(choices[name]).map(([key, title]) => (
            <option value={key} key={key}>
              {title}
            </option>
          ))}
        </select>
      </label>
    );
  if (typeof value === 'boolean')
    return (
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        {label}
      </label>
    );
  if (value === null)
    return (
      <label className="admin-field" htmlFor={path}>
        {label}
        <input
          id={path}
          type="number"
          value=""
          disabled={translated || locked}
          placeholder="Не задано"
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
        />
      </label>
    );
  const long =
    typeof value === 'string' &&
    (value.length > 120 || /description|notes|content|text|answer|blurb|summary/i.test(name));
  return (
    <label className={`admin-field${long ? ' admin-wide' : ''}`} htmlFor={path}>
      {label}
      {long ? (
        <textarea
          id={path}
          rows={name === 'content' ? 14 : 4}
          value={String(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={path}
          type={typeof value === 'number' ? 'number' : 'text'}
          step="any"
          value={value}
          disabled={disabled || name === 'tag' || name === 'key'}
          onChange={(event) => onChange(typeof value === 'number' ? Number(event.target.value) : event.target.value)}
        />
      )}
    </label>
  );
}
