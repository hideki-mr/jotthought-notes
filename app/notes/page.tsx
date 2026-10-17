"use client";

import Link from "next/link";
import { FormEvent, startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export default function NotesPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("noted-user");
    if (!savedEmail) {
      router.replace("/");
      return;
    }

    let savedNotes: Note[] = [];
    try {
      const storedNotes = localStorage.getItem(`noted-notes:${savedEmail}`);
      savedNotes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : [];
    } catch {}

    startTransition(() => {
      setEmail(savedEmail);
      setNotes(savedNotes);
      setReady(true);
    });
  }, [router]);

  useEffect(() => {
    if (ready && email && sessionStorage.getItem("noted-user") === email) {
      localStorage.setItem(`noted-notes:${email}`, JSON.stringify(notes));
    }
  }, [email, notes, ready]);

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() && !body.trim()) return;

    const note: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled note",
      body: body.trim(),
      createdAt: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setNotes((currentNotes) => [note, ...currentNotes]);
    setTitle("");
    setBody("");
  }

  function handleLogout() {
    sessionStorage.removeItem("noted-user");
    router.replace("/");
  }

  if (!ready) return <main className="notes-loading" aria-label="Loading notes" />;

  return (
    <main className="notes-shell">
      <header className="notes-header">
        <Link className="wordmark notes-wordmark" href="/notes" aria-label="JotThought notebook">
          <span className="wordmark-icon" aria-hidden="true">JT</span>
          JotThought
        </Link>
        <div className="account-actions">
          <span className="account-email">{email}</span>
          <button className="logout-button" type="button" onClick={handleLogout}>Log out <span aria-hidden="true">↗</span></button>
        </div>
      </header>

      <section className="notes-content">
        <div className="notes-heading">
          <p className="eyebrow">YOUR PERSONAL NOTEBOOK</p>
          <h1>Good thoughts,<br /><span>kept close.</span></h1>
          <p className="notes-subtitle">A place to collect whatever is on your mind.</p>
        </div>

        <form className="compose-form" onSubmit={handleAddNote}>
          <label className="compose-label" htmlFor="note-title">A new note <span aria-hidden="true">✳</span></label>
          <input
            id="note-title"
            className="note-title-input"
            type="text"
            placeholder="Give this thought a title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            aria-label="Note details"
            placeholder="Write it down before it wanders off."
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <div className="compose-footer">
            <span>Saved in this browser</span>
            <button className="add-note-button" type="submit">Add note <span aria-hidden="true">＋</span></button>
          </div>
        </form>

        <section className="saved-notes" aria-labelledby="saved-notes-title">
          <div className="section-heading">
            <h2 id="saved-notes-title">Your notes</h2>
            <span>{notes.length.toString().padStart(2, "0")}</span>
          </div>
          {notes.length === 0 ? (
            <p className="empty-notes">Your notebook is open. Add a note whenever something comes to mind.</p>
          ) : (
            <div className="notes-grid">
              {notes.map((note, index) => (
                <article className={`note-card note-card-${index % 3}`} key={note.id}>
                  <div className="note-card-top">
                    <span className="note-card-mark" aria-hidden="true">✳</span>
                    <time>{note.createdAt}</time>
                    <button
                      className="delete-note-button"
                      type="button"
                      aria-label={`Delete ${note.title}`}
                      onClick={() => setNotes((currentNotes) => currentNotes.filter((item) => item.id !== note.id))}
                    >
                      ×
                    </button>
                  </div>
                  <h3>{note.title}</h3>
                  {note.body && <p>{note.body}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}