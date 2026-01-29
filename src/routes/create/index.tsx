import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { PRForm } from "~/components/pr/pr-form";
import { LinePreview } from "~/components/pr/line-preview";
import { api, type PRBubbleCreate } from "~/lib/api";

export default component$(() => {
  const nav = useNavigate();
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);

  const previewTitle = useSignal("");
  const previewDescription = useSignal("");
  const previewImageUrl = useSignal("");
  const previewTagText = useSignal("GIZMART");
  const previewTagColor = useSignal("#FF1BE8");

  const handlePreviewChange = $((data: Partial<PRBubbleCreate>) => {
    if (data.title !== undefined) previewTitle.value = data.title;
    if (data.description !== undefined) previewDescription.value = data.description;
    if (data.image_url !== undefined) previewImageUrl.value = data.image_url;
    if (data.tag_text !== undefined) previewTagText.value = data.tag_text;
    if (data.tag_color !== undefined) previewTagColor.value = data.tag_color;
  });

  const handleSubmit = $(async (data: PRBubbleCreate) => {
    isLoading.value = true;
    error.value = null;
    try {
      await api.pr.create(data);
      await nav("/");
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to create PR";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="animate-fade-in">
      <div class="mb-8">
        <a href="/" class="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← 一覧に戻る
        </a>
        <h1 class="text-3xl font-bold text-white mt-4">新規PR作成</h1>
      </div>

      {error.value && (
        <div class="glass-card border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 mb-6">
          <p class="text-[var(--color-error)]">{error.value}</p>
        </div>
      )}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div class="glass-card p-6">
          <h2 class="text-xl font-semibold text-white mb-6">PR情報</h2>
          <PRForm
            onSubmit$={handleSubmit}
            onPreviewChange$={handlePreviewChange}
            isLoading={isLoading.value}
          />
        </div>

        {/* Preview Section */}
        <div class="lg:sticky lg:top-24 lg:self-start">
          <div class="glass-card p-6">
            <h2 class="text-xl font-semibold text-white mb-6">プレビュー</h2>
            <LinePreview
              title={previewTitle.value}
              description={previewDescription.value}
              imageUrl={previewImageUrl.value}
              tagText={previewTagText.value}
              tagColor={previewTagColor.value}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "新規PR作成",
  meta: [
    {
      name: "description",
      content: "新しいLINE Flex Message PRバブルを作成",
    },
  ],
};
