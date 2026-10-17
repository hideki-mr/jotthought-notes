"use client";

import { ChangeEvent, FormEvent, startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pinnedNote, setPinnedNote] = useState("Start where you are.\nWrite one thing down.");

  useEffect(() => {
    const savedNote = localStorage.getItem("jotthought-pinned-note");
    if (savedNote !== null) {
      startTransition(() => setPinnedNote(savedNote));
    }
  }, []);

  function handlePinnedNoteChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const updatedNote = event.currentTarget.value;
    setPinnedNote(updatedNote);
    localStorage.setItem("jotthought-pinned-note", updatedNote);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(normalizedEmail)) {
      setError("Enter a valid Gmail address ending in @gmail.com.");
      return;
    }

    if (password.length <= 6) {
      setError("Your password must be more than 6 characters.");
      return;
    }

    sessionStorage.setItem("noted-user", normalizedEmail);
    setError("");
    router.push("/notes");
  }

  return (
    <main className="login-shell">
      <section className="login-intro" aria-label="JotThought introduction">
        <Link className="wordmark" href="/" aria-label="JotThought home">
          <span className="wordmark-icon" aria-hidden="true">JT</span>
          JotThought
        </Link>
        <div className="intro-copy">
          <p className="eyebrow">A little space for your thoughts</p>
          <h1>Get it out<br />of your head.</h1>
          <p className="intro-description">Keep the ideas, reminders, and little things you don’t want to lose.</p>
        </div>
        <div className="paper-note">
          <span className="note-pin" />
          <span className="paper-date">A NOTE TO SELF · 01</span>
          <textarea
            className="paper-note-input"
            aria-label="Pinned note text. It saves automatically."
            rows={4}
            maxLength={120}
            value={pinnedNote}
            onChange={handlePinnedNoteChange}
          />
          <span className="paper-scribble" aria-hidden="true">↗</span>
        </div>
        <p className="intro-footer">A quieter place to think.</p>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <p className="eyebrow form-eyebrow">YOUR NOTEBOOK AWAITS</p>
          <h2>Welcome back.</h2>
          <p className="form-description">Sign in to pick up where your thoughts left off.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby={error ? "login-error" : undefined}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="At least 7 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby={error ? "login-error" : undefined}
            />

            <button className="login-button" type="submit">Open my notebook <span aria-hidden="true">→</span></button>
            <p className="login-error" id="login-error" role="alert">{error}</p>
          </form>
          <p className="form-footnote">For this demo, use any Gmail address and a password longer than 6 characters.</p>
        </div>
      </section>
    </main>
  );
}
