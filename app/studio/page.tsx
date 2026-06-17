import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CornerDownLeft, Library } from "lucide-react";
import { auth } from "@/auth";
import { listShelf } from "@/lib/data/projects";
import { createProjectAction } from "@/app/studio/actions";
import { Button } from "@/components/ui/button";
import { Halftone } from "@/components/comic/halftone";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Bookshelf } from "@/components/studio/bookshelf";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your studio" };

export default async function StudioDashboard({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/studio");

  const books = await listShelf(session.user.id);
  const name = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-[80vh] bg-paper">
      <section className="relative overflow-hidden border-b-2 border-ink">
        <Halftone className="absolute -right-16 top-0 h-56 w-56 opacity-[0.1]" dot={11} />
        <div className="container-page py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="kicker mb-1">Your studio</p>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
                Hi {name} 👋
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border-2 border-ink bg-accent px-3 py-1 text-sm font-bold uppercase tracking-wide">
                {session.user.plan} plan
              </span>
              {session.user.plan === "FREE" && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-ink px-3 py-1 text-sm font-bold text-paper transition-colors hover:bg-ink/90"
                >
                  Upgrade
                </Link>
              )}
              <SignOutButton />
            </div>
          </div>

          {searchParams.upgraded && (
            <div className="mt-6 rounded-panel border-2 border-ink bg-pop-mint/20 px-4 py-3 text-sm font-semibold text-ink">
              🎉 You&apos;re upgraded — your new plan is active. (If it still says FREE, give the
              webhook a few seconds, then refresh.)
            </div>
          )}

          {/* start a new comic */}
          <form
            action={createProjectAction}
            className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full border-2 border-ink bg-white p-1.5 pl-4 shadow-panel"
          >
            <span className="font-mono text-ink-faint">›</span>
            <input
              name="premise"
              required
              aria-label="Describe your comic idea"
              placeholder="A retired samurai fox opens a tea shop…"
              className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-ink-faint"
            />
            <Button type="submit" variant="primary" className="shrink-0">
              Start a new comic <CornerDownLeft size={16} />
            </Button>
          </form>
          <p className="mt-2 text-sm text-ink-faint">
            One line is enough — you&apos;ll shape the rest in the studio.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-xl font-extrabold">
            <Library size={20} /> {books.length > 0 ? "Your bookshelf" : "Your bookshelf is empty"}
          </h2>
          <span className="font-mono text-sm text-ink-faint">
            {books.length} {books.length === 1 ? "comic" : "comics"}
          </span>
        </div>

        {books.length === 0 ? (
          <div className="relative">
            <div className="grid place-items-center rounded-panel border-2 border-dashed border-ink/40 bg-white py-16 text-center">
              <div className="flex max-w-sm flex-col items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-accent">
                  <Library size={24} />
                </span>
                <p className="font-display text-xl font-extrabold">Shelve your first comic</p>
                <p className="text-ink-soft">
                  Type an idea above and it&apos;ll appear here as a book you can open
                  and keep building.
                </p>
              </div>
            </div>
            <div className="shelf-plank mx-1 mt-[-6px] h-4 rounded-b-md" />
          </div>
        ) : (
          <Bookshelf books={books} />
        )}
      </section>
    </div>
  );
}
