"use client";

import React, { useState } from "react";
import { PhoneCall, Check } from "lucide-react";
import { T } from "./T";
import { useAutoText } from "../../hooks/useAutoText";

type Status = "idle" | "sending" | "success" | "error";

export default function CallbackForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    const namePlaceholder = useAutoText("Your name");
    const phonePlaceholder = useAutoText("Phone number");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const res = await fetch("/api/callback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, website, page: window.location.pathname }),
            });
            if (!res.ok) throw new Error("Request failed");
            setStatus("success");
            setName("");
            setPhone("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                    <PhoneCall className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[var(--color-text)]">
                    <T>Request a Callback</T>
                </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-gray-500)]">
                <T>Leave your name and phone number and we will call you back.</T>
            </p>

            {status === "success" ? (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-[var(--color-primary)]/10 p-4 text-sm font-medium text-[var(--color-primary)]">
                    <Check className="h-5 w-5 shrink-0" />
                    <T>Thank you! We will call you back soon.</T>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        name="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="hidden"
                    />
                    <input
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={namePlaceholder}
                        aria-label={namePlaceholder}
                        className="h-12 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-5 text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                        type="tel"
                        required
                        maxLength={25}
                        pattern="[+\(\)\-.\s\d]{7,25}"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={phonePlaceholder}
                        aria-label={phonePlaceholder}
                        className="h-12 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-5 text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                    />
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="h-12 rounded-full bg-[var(--color-accent)] px-8 font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent)]/90 disabled:opacity-60"
                    >
                        {status === "sending" ? <T>Sending...</T> : <T>Call Me Back</T>}
                    </button>
                </form>
            )}

            {status === "error" && (
                <p className="mt-3 text-sm text-[var(--color-error)]">
                    <T>Something went wrong. Please call us at (888) 336-2330.</T>
                </p>
            )}
        </div>
    );
}
