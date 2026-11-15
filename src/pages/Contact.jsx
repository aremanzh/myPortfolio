import React, { useRef, useState } from "react";
import { useDocumentTitle, useIntro, useLocalTime } from "../lib/hooks";
import { site } from "../data/site";
import { ArrowUpRight } from "../components/Icons";

const IDLE = "idle";
const SENDING = "sending";
const SENT = "sent";
const FAILED = "failed";

function ContactForm() {
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
          Message sent. <span className="serif accent">Thank you.</span>
        </p>
        <p className="t-body mt-4">I’ll reply to the address you gave.</p>
        <button type="button" className="btn t-mono mt-8" onClick={() => setStatus(IDLE)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form action={site.formEndpoint} method="POST" onSubmit={submit} className="grid gap-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="name" className="t-mono">
            01 / Your name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
        </div>
        <div className="field">
          <label htmlFor="email" className="t-mono">
            02 / Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="message" className="t-mono">
          03 / What are you building?
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="The product, where it runs today, and what you need."
          required
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn btn--solid t-mono" disabled={status === SENDING}>
          {status === SENDING ? "Sending" : "Send message"} <ArrowUpRight />
        </button>
        {status === FAILED && (
          <p role="alert" className="t-body max-w-[40ch]">
            That didn’t go through. Try again, or email{" "}
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

export default function Contact() {
  const root = useRef(null);
  const time = useLocalTime();
  useDocumentTitle("Contact");

  useIntro(root, (tl) => {
    tl.from(".line__in", { yPercent: 112, duration: 1.3, ease: "expo.out", stagger: 0.1 }).from(
      ".contact__fade",
      { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 },
      0.5
    );
  });

  return (
    <div ref={root} className="theme-ink">
      <header className="wrap pb-[clamp(3rem,6vw,6rem)] pt-[clamp(8rem,16vw,14rem)]">
        <p className="contact__fade t-mono eyebrow">Contact</p>
        <h1 className="t-mega mt-8">
          <span className="line">
            <span className="line__in">Tell me what</span>
          </span>
          <span className="line">
            <span className="line__in">
              you’re <span className="serif accent">building.</span>
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
            <h2 className="t-mono text-[color:var(--muted)]">Email</h2>
            <a
              href={`mailto:${site.email}`}
              className="link link--on mt-2 inline-block break-all text-lg font-medium tracking-tight"
            >
              {site.email}
            </a>
          </div>
          <div className="border-t border-[color:var(--line)] pt-4">
            <h2 className="t-mono text-[color:var(--muted)]">Elsewhere</h2>
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
            <h2 className="t-mono text-[color:var(--muted)]">Where and when</h2>
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
