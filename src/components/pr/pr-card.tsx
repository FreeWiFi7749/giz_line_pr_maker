import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { PRBubble } from "~/lib/api";

interface PRCardProps {
  pr: PRBubble;
  onDuplicate$?: (id: string) => void;
  onDelete$?: (id: string) => void;
}

export const PRCard = component$<PRCardProps>((props) => {
  const { pr } = props;

  const statusBadge = {
    draft: { class: "glass-badge-info", label: "下書き" },
    active: { class: "glass-badge-success", label: "公開中" },
    inactive: { class: "glass-badge-warning", label: "終了" },
  }[pr.status];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='182' viewBox='0 0 280 182'%3E%3Crect fill='%23374151' width='280' height='182'/%3E%3Ctext fill='%239CA3AF' font-family='sans-serif' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div class="glass-card p-0 overflow-hidden animate-scale-in">
      {/* Image */}
      <div class="relative">
        <img
          src={pr.image_url || placeholderImage}
          alt={pr.title}
          class="w-full aspect-[20/13] object-cover"
          width={280}
          height={182}
        />
        <div
          class="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white"
          style={{ backgroundColor: pr.tag_color }}
        >
          {pr.tag_text}
        </div>
        <div class={`absolute top-3 right-3 glass-badge ${statusBadge.class}`}>
          {statusBadge.label}
        </div>
      </div>

      {/* Content */}
      <div class="p-5">
        <h3 class="text-lg font-semibold text-white mb-2 line-clamp-2">
          {pr.title}
        </h3>
        <p class="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
          {pr.description}
        </p>

        {/* Date Range */}
        <div class="text-xs text-[var(--color-text-muted)] mb-4">
          {formatDate(pr.start_date)} 〜 {formatDate(pr.end_date)}
        </div>

        {/* Stats */}
        <div class="flex gap-4 mb-4">
          <div class="stats-card flex-1 text-center py-3">
            <div class="stats-value text-lg">{pr.view_count.toLocaleString()}</div>
            <div class="stats-label text-xs">見られた</div>
          </div>
          <div class="stats-card flex-1 text-center py-3">
            <div class="stats-value text-lg">{pr.click_count.toLocaleString()}</div>
            <div class="stats-label text-xs">タップされた</div>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-2">
          <Link
            href={`/edit/${pr.id}`}
            class="glass-button flex-1 text-center text-sm py-2"
          >
            編集
          </Link>
          <button
            type="button"
            onClick$={() => props.onDuplicate$?.(pr.id)}
            class="glass-button px-3 py-2 text-sm"
            title="複製"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick$={() => props.onDelete$?.(pr.id)}
            class="glass-button px-3 py-2 text-sm text-[var(--color-error)]"
            title="削除"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});
