import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { PRCard } from "~/components/pr/pr-card";
import { api, type PRBubble } from "~/lib/api";

export default component$(() => {
  const prList = useSignal<PRBubble[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const statusFilter = useSignal<string>("");
  const currentPage = useSignal(1);
  const totalPages = useSignal(1);

  const loadPRs = $(async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.pr.list({
        status: statusFilter.value || undefined,
        page: currentPage.value,
        limit: 12,
      });
      prList.value = response.items;
      totalPages.value = Math.ceil(response.total / response.limit);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load PRs";
    } finally {
      isLoading.value = false;
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => statusFilter.value);
    track(() => currentPage.value);
    loadPRs();
  });

  const handleDuplicate = $(async (id: string) => {
    try {
      await api.pr.duplicate(id);
      await loadPRs();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to duplicate PR";
    }
  });

  const handleDelete = $(async (id: string) => {
    if (!confirm("このPRを削除してもよろしいですか？")) return;
    try {
      await api.pr.delete(id);
      await loadPRs();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to delete PR";
    }
  });

  return (
    <div class="animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 class="text-3xl font-bold text-white">作成したPR枠</h1>

        {/* Status Filter */}
        <div class="flex gap-2">
          {[
            { value: "", label: "すべて" },
            { value: "draft", label: "下書き" },
            { value: "active", label: "公開中" },
            { value: "inactive", label: "終了" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick$={() => {
                statusFilter.value = filter.value;
                currentPage.value = 1;
              }}
              class={`glass-button px-4 py-2 text-sm ${
                statusFilter.value === filter.value
                  ? "glass-button-primary"
                  : ""
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error.value && (
        <div class="glass-card border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 mb-6">
          <p class="text-[var(--color-error)]">{error.value}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading.value && (
        <div class="flex justify-center py-12">
          <div class="spinner" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading.value && prList.value.length === 0 && (
        <div class="glass-card text-center py-16">
          <svg
            class="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 class="text-xl font-semibold text-white mb-2">
            まだPR枠がありません
          </h2>
          <p class="text-[var(--color-text-muted)] mb-6">
            新しいPR枠を作成して、ダイジェスト配信に載せましょう
          </p>
          <a href="/create" class="glass-button glass-button-primary px-6 py-3">
            + 新規作成
          </a>
        </div>
      )}

      {/* PR Grid */}
      {!isLoading.value && prList.value.length > 0 && (
        <>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prList.value.map((pr) => (
              <PRCard
                key={pr.id}
                pr={pr}
                onDuplicate$={handleDuplicate}
                onDelete$={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages.value > 1 && (
            <div class="flex justify-center gap-2 mt-8">
              <button
                type="button"
                onClick$={() => (currentPage.value = Math.max(1, currentPage.value - 1))}
                disabled={currentPage.value === 1}
                class="glass-button px-4 py-2"
              >
                前へ
              </button>
              <span class="glass-button px-4 py-2 cursor-default">
                {currentPage.value} / {totalPages.value}
              </span>
              <button
                type="button"
                onClick$={() =>
                  (currentPage.value = Math.min(totalPages.value, currentPage.value + 1))
                }
                disabled={currentPage.value === totalPages.value}
                class="glass-button px-4 py-2"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "作成したPR枠",
  meta: [
    {
      name: "description",
      content: "作成したPR枠の一覧",
    },
  ],
};
