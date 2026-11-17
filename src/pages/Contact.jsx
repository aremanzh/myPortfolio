import React, { useRef, useState } from "react";
import { useDocumentTitle, useIntro, useLocalTime } from "../lib/hooks";
import { contentFor, useContent } from "../data/site";
import { localeOf, translate, useT } from "../i18n";
import { preview } from "../lib/env";
import { ArrowUpRight } from "../components/Icons";
import { pageMeta } from "../lib/meta";

const IDLE = "idle";
const SENDING = "sending";
const SENT = "sent";
const FAILED = "failed";

function ContactForm() {
  const t = useT();
  const { site } = useContent();
  const [status, setStatus] = useState(IDLE);

  // The form also works without JS: it posts straight to the endpoint.
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real visitors never see or fill this field.
    if (data.get("website")) {
      setStatus(SENT);
      return;
    }
    data.delete("website");

    // A preview build has nowhere to send this, and must not pretend it did.
    if (preview) {
      setStatus(SENT);
      return;
    }

    setStatus(SENDING);
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Form endpoint answered ${response.status}`);
      form.reset();
      setStatus(SENT);
    } catch (error) {
      console.error(error);
      setStatus(FAILED);
    }
  };

  if (status === SENT) {
    return (
      <div role="status" className="border-t border-[color:var(--line)] pt-8">
        <p className="t-lead">
          {t("contact.sentPre")}
          <span className="serif accent">{t("contact.sentAccent")}</span>
        </p>
        <p className="t-body mt-4">
          {preview ? t("contact.sentPreview") : t("contact.sentNote")}
        </p>
        <button type="button" className="btn t-mono mt-8" onClick={() => setStatus(IDLE)}>
          {t("contact.again")}
        </button>
      </div>
    );
  }

  return (
    <form
      action={preview ? undefined : site.formEndpoint}
      method="POST"
      onSubmit={submit}
      className="grid gap-10"
    >
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="name" className="t-mono">
            {t("contact.name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("contact.namePlaceholder")}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email" className="t-mono">
            {t("contact.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("contact.emailPlaceholder")}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="message" className="t-mono">
          {t("contact.message")}
        </label>
        <textarea
          id="message"
          name="message"
          placeholder={t("contact.messagePlaceholder")}
          required
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">{t("contact.honeypot")}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn btn--solid t-mono" disabled={status === SENDING}>
          {status === SENDING ? t("contact.sending") : t("contact.send")} <ArrowUpRight />
        </button>
        {status === FAILED && (
          <p role="alert" className="t-body max-w-[40ch]">
            {t("contact.failed")}{" "}
            <a href={`mailto:${site.email}`} className="link link--on text-[color:var(--fg)]">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

export function meta({ location }) {
  const locale = localeOf(location.pathname);
  const { site } = contentFor(locale);
  return pageMeta({
    title: translate(locale, "contact.title"),
    description: translate(locale, "contact.description", {
      name: site.shortName,
      availability: site.availabilityLabel,
      location: site.location,
    }),
    path: "/contact",
    locale,
  });
}

export default function Contact() {
  const t = useT();
  const { site } = useContent();
  const root = useRef(null);
  const time = useLocalTime();
  useDocumentTitle(t("contact.title"));

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.07 }).from(
      ".contact__fade",
      { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07 },
      0.5
    );
  });

  return (
    <div ref={root} className="theme-ink">
      <header className="wrap pb-[clamp(3rem,6vw,6rem)] pt-[clamp(8rem,16vw,14rem)]">
        <p className="contact__fade t-mono eyebrow">{t("contact.eyebrow")}</p>
        <h1 className="t-mega mt-8">
          <span className="line">
            <span className="line__in">{t("contact.line1")}</span>
          </span>
          <span className="line">
            <span className="line__in">
              {t("contact.line2Pre")}
              <span className="serif accent">{t("contact.line2Accent")}</span>
            </span>
          </span>
        </h1>
      </header>

      <div className="wrap grid gap-16 pb-[clamp(5rem,11vw,11rem)] lg:grid-cols-12 lg:gap-10">
        <div className="contact__fade lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="contact__fade grid content-start gap-8 lg:col-span-4 lg:col-start-9">
          <div className="border-t border-[color:var(--line)] pt-4">
            <h2 className="t-mono text-[color:var(--muted)]">{t("contact.emailLabel")}</h2>
            <a
              href={`mailto:${site.email}`}
              className="link link--on mt-2 inline-block break-all text-lg font-medium tracking-tight"
            >
              {site.email}
            </a>
          </div>
          <div className="border-t border-[color:var(--line)] pt-4">
            <h2 className="t-mono text-[color:var(--muted)]">{t("contact.elsewhere")}</h2>
            <ul className="mt-2 grid gap-1 text-lg font-medium tracking-tight">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="link">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[color:var(--line)] pt-4">
            <h2 className="t-mono text-[color:var(--muted)]">{t("contact.whereWhen")}</h2>
            <p className="mt-2 text-lg font-medium tracking-tight">
              {site.location}
              <br />
              <span className="tabular-nums">
                {time} {site.timeZoneLabel}
              </span>
            </p>
          </div>
          <p className={`badge t-mono ${site.available ? "badge--on" : ""}`}>
            <span className="badge__dot" />
            {site.available ? site.availabilityLabel : site.unavailableLabel}
          </p>
        </aside>
      </div>
    </div>
  );
}
