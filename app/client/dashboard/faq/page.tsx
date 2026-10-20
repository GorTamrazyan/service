"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Phone, ArrowRight } from "lucide-react";
import { T } from "../../components/T";
import CallbackForm from "../../components/CallbackForm";
import { faqs } from "./faqs";

export default function FaqPage() {
    return (
        <div className="mx-auto max-w-4xl py-10 md:py-16">
            <div className="text-center">
                <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                    <T>FAQ</T>
                </span>
                <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-primary)] md:text-5xl">
                    <T>Frequently Asked Questions</T>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-gray-500)] md:text-lg">
                    <T>Everything you need to know about vinyl fences, pricing, installation, and our warranty.</T>
                </p>
            </div>

            <div className="mt-12 space-y-3">
                {faqs.map((f) => (
                    <details
                        key={f.question}
                        className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 open:shadow-md"
                    >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold text-[var(--color-text)] [&::-webkit-details-marker]:hidden">
                            <T>{f.question}</T>
                            <ChevronDown className="h-5 w-5 shrink-0 text-[var(--color-accent)] transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-4 text-sm leading-relaxed text-[var(--color-gray-500)] md:text-base">
                            <T>{f.answer}</T>
                        </p>
                    </details>
                ))}
            </div>

            <div className="mt-14">
                <CallbackForm />
            </div>

            <div className="mt-14 rounded-2xl bg-[var(--color-primary)] p-8 text-center sm:p-12">
                <h2 className="font-serif text-3xl font-semibold text-white">
                    <T>Still have questions?</T>
                </h2>
                <p className="mt-3 text-white/85">
                    <T>Call us or book a free on-site estimate.</T>
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="tel:+18883362330"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-[var(--color-primary)] transition-colors hover:bg-white/90"
                    >
                        <Phone className="h-4 w-4" /> (888) 336-2330
                    </a>
                    <Link
                        href="/client/dashboard/service"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        <T>Get a Free Quote</T> <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
