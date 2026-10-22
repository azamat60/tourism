'use client';

import { useCatalog, useTranslation } from './SiteData';

import { countryName } from '@/lib/i18n';

import { useState } from 'react';
import type { Locale } from '@/lib/content';
import type { Tour } from '@/lib/types';
import { ageOnDate, type Traveler } from '@/lib/checkout';
import { addOnPrice } from '@/lib/catalog';

import SignaturePad from './SignaturePad';

type Props = { locale?: Locale; traveler: Traveler; index: number; lead: Traveler; today: string; tour: Tour; contactRequired: boolean; update: (next: Traveler) => void; remove: () => void };
export default function TravelerFields({ traveler, index, lead, today, tour, contactRequired, update, remove, locale = 'en' }: Props) {
  const { checkout, countryOptions, waiverClauses } = useCatalog();
  const t = useTranslation();

  const [phoneTouched, setPhoneTouched] = useState(false);
  const set = (key: keyof Traveler, value: string | string[]) => update({ ...traveler, [key]: value });
  const field = (label: string, key: keyof Traveler, type = 'text', required = false) => <label>{t(locale, label)}<input type={type} value={String(traveler[key])} onChange={(event) => set(key, event.target.value)} required={required} maxLength={type === 'text' ? 200 : undefined} /></label>;
  const country = (label: string, key: 'nationality' | 'addressCountry') => <label>{t(locale, label)}<select value={traveler[key]} required onChange={(event) => {
    const value = event.target.value;
    update({ ...traveler, [key]: value, ...(key === 'nationality' && !phoneTouched ? { phoneCountry: value } : {}) });
  }}><option value="">{t(locale, "Select country")}</option>{countryOptions.map((item) => <option value={item.iso} key={item.iso}>{countryName(locale, item.iso, item.name)}</option>)}</select></label>;
  const phone = (emergency = false) => {
    const key = emergency ? 'emergencyPhone' : 'phone'; const countryKey = emergency ? 'emergencyPhoneCountry' : 'phoneCountry';
    return <label>{t(locale, emergency ? 'Emergency contact phone' : 'WhatsApp number')}<span className="source-phone"><select aria-label={t(locale, emergency ? 'Emergency phone country code' : 'Phone country code')} value={traveler[countryKey]} onChange={(event) => { if (!emergency) setPhoneTouched(true); set(countryKey, event.target.value); }}>{countryOptions.map((item) => <option value={item.iso} key={item.iso}>{t(locale, item.dial)} {countryName(locale, item.iso, item.name)}</option>)}</select><input type="tel" aria-label={t(locale, emergency ? 'Emergency phone number' : 'WhatsApp phone number')} value={traveler[key]} onChange={(event) => set(key, event.target.value)} required={emergency || contactRequired} /></span></label>;
  };
  const minor = (ageOnDate(traveler.dob, today) ?? 18) < 18;
  return <section className="source-traveler" id={`traveler-${index}`}><div className="source-toolbar"><h2>{t(locale, "Traveler ")}{t(locale, index + 1)}{t(locale, index === 0 ? ' · Primary contact' : '')}</h2>{index > 0 && <button type="button" onClick={remove}>{t(locale, "Remove traveler")}</button>}</div>
    <div className="booking-field-grid">{field('First name', 'firstName', 'text', true)}{field('Last name', 'lastName', 'text', true)}{field('Pickup location / accommodation', 'pickupLocation')}{field('Email', 'email', 'email', contactRequired)}{phone()}{country('Nationality', 'nationality')}<label>{t(locale, "Date of birth")}<input type="date" value={traveler.dob} min="1900-01-01" max={today} required onChange={(event) => set('dob', event.target.value)} /></label><label>{t(locale, "Gender")}<select value={traveler.gender} onChange={(event) => set('gender', event.target.value)}><option value="">{t(locale, "Select")}</option>{checkout.GENDER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(locale, option.label)}</option>)}</select></label><label>{t(locale, "Vegetarian")}<select value={traveler.vegetarian} onChange={(event) => set('vegetarian', event.target.value)}><option value="">{t(locale, "Select")}</option><option value="yes">{t(locale, "Yes")}</option><option value="no">{t(locale, "No")}</option></select></label></div>
    <h3>{t(locale, "Emergency contact")}</h3>{index > 0 && <button type="button" className="source-action" onClick={() => update({ ...traveler, emergencyName: lead.emergencyName, emergencyEmail: lead.emergencyEmail, emergencyPhone: lead.emergencyPhone, emergencyPhoneCountry: lead.emergencyPhoneCountry })}>{t(locale, "Same emergency contact as Traveler 1")}</button>}
    <div className="booking-field-grid">{field('Emergency contact name', 'emergencyName', 'text', true)}{field('Emergency contact email', 'emergencyEmail', 'email', true)}{phone(true)}</div>
    <p>{t(locale, "Your emergency contact must be someone who is not traveling with you.")}</p>
    {Boolean(tour.optionalAddOns?.some((item) => item.scope !== 'group')) && <fieldset className="source-fieldset"><legend>{t(locale, "Traveler add-ons")}</legend>{tour.optionalAddOns?.filter((item) => item.scope !== 'group').map((item) => <label key={item.name} className="source-check"><input type="checkbox" checked={traveler.extras.includes(item.name)} onChange={() => set('extras', traveler.extras.includes(item.name) ? traveler.extras.filter((name) => name !== item.name) : [...traveler.extras, item.name])} /><span><strong>{t(locale, item.name)} · ${t(locale, addOnPrice(item, tour))}</strong><small>{t(locale, item.description)}</small></span></label>)}</fieldset>}
    <label className="source-search">{t(locale, "Additional notes")}<textarea value={traveler.notes} onChange={(event) => set('notes', event.target.value)} rows={2} /></label>
    <section className="source-waiver"><h3>{t(locale, "Acknowledgment of Risk & Release of Liability")}</h3><p>{t(locale, "Waiver version: ")}{t(locale, checkout.WAIVER_VERSION)}</p><p className="source-note">{t(locale, "Your waiver and signature will be stored with your reservation.")}</p><label className="source-search">{t(locale, "Your initials")}<input value={traveler.initials} onChange={(event) => set('initials', event.target.value)} maxLength={10} required /></label>
      {waiverClauses.map((clause, clauseIndex) => <label className="source-check source-clause" key={clause.key}><input type="checkbox" checked={traveler.initialed.includes(clause.key)} onChange={() => set('initialed', traveler.initialed.includes(clause.key) ? traveler.initialed.filter((key) => key !== clause.key) : [...traveler.initialed, clause.key])} required /><span><strong>{t(locale, clauseIndex + 1)}. {traveler.initials}</strong> {t(locale, clause.text)}{'subItems' in clause && clause.subItems && <ul>{clause.subItems.map((item) => <li key={item}>{t(locale, item)}</li>)}</ul>}</span></label>)}
      <fieldset className="source-fieldset"><legend>{t(locale, "Photography & media")}</legend><p>{t(locale, "I grant Nomad Discovery Tours permission to photograph or film me and use the images for promotional purposes (social media, website, marketing) without compensation.")}</p>{[['yes', 'I consent'], ['no', 'I do not consent']].map(([value, label]) => <label className="source-check" key={value}><input type="radio" name={`media-${index}`} value={value} checked={traveler.mediaConsent === value} onChange={() => set('mediaConsent', value)} required />{t(locale, label)}</label>)}</fieldset>
      <h3>{t(locale, "Signer address")}</h3>{index > 0 && <button type="button" className="source-action" onClick={() => update({ ...traveler, addressLine: lead.addressLine, city: lead.city, region: lead.region, postal: lead.postal, addressCountry: lead.addressCountry })}>{t(locale, "Same address as Traveler 1")}</button>}<div className="booking-field-grid">{field('Street address', 'addressLine', 'text', true)}{field('City', 'city', 'text', true)}{field('State / region (optional)', 'region')}{field('Postal code', 'postal', 'text', true)}{country('Country', 'addressCountry')}</div>
      <SignaturePad locale={locale} label={t(locale, `Traveler ${index + 1} signature`)} value={traveler.signature} onChange={(value) => set('signature', value)} />
      {minor && <div><h3>{t(locale, "Parent / guardian")}</h3><div className="booking-field-grid">{field('Guardian name', 'guardianName', 'text', true)}{field('Relationship to traveler', 'guardianRelationship', 'text', true)}</div><SignaturePad locale={locale} label={t(locale, `Guardian signature for Traveler ${index + 1}`)} value={traveler.guardianSignature} onChange={(value) => set('guardianSignature', value)} /></div>}
    </section>
  </section>;
}
