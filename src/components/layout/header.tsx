import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Header = component$(() => {
  return (
    <header class="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1BE8] to-[#FF1BE8]/60 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <span class="text-xl font-bold text-white">PR Maker</span>
        </Link>

        <nav class="flex items-center gap-4">
          <Link
            href="/"
            class="glass-button px-4 py-2 text-sm"
          >
            作成したPR枠
          </Link>
          <Link
            href="/create"
            class="glass-button glass-button-primary px-4 py-2 text-sm"
          >
            + 新規作成
          </Link>
        </nav>
      </div>
    </header>
  );
});
