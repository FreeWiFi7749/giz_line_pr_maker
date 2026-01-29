import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { PRForm } from "~/components/pr/pr-form";
import { LinePreview } from "~/components/pr/line-preview";
import { api, type PRBubble, type PRBubbleCreate, type PRBubbleUpdate } from "~/lib/api";

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const prId = loc.params.id;

  const pr = useSignal<PRBubble | null>(null);
  const isLoading = useSignal(true);
  const isSaving = useSignal(false);
  const error = useSignal<string | null>(null);

  const previewTitle = useSignal("");
  const previewDescription = useSignal("");
  const previewImageUrl = useSignal("");
  const previewTagText = useSignal("GIZMART");
  const previewTagColor = useSignal("#FF1BE8");

  useTask$(async () => {
    try {
      const data = await api.pr.get(prId);
      pr.value = data;
      previewTitle.value = data.title;
      previewDescription.value = data.description;
      previewImageUrl.value = data.image_url;
      previewTagText.value = data.tag_text;
      previewTagColor.value = data.tag_color;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load PR";
    } finally {
      isLoading.value = false;
    }
  });

  const handlePreviewChange = $((data: Partial<PRBubbleCreate>) => {
    if (data.title !== undefined) previewTitle.value = data.title;
    if (data.description !== undefined) previewDescription.value = data.description;
    if (data.image_url !== undefined) previewImageUrl.value = data.image_url;
    if (data.tag_text !== undefined) previewTagText.value = data.tag_text;
    if (data.tag_color !== undefined) previewTagColor.value = data.tag_color;
  });

  const handleSubmit = $(async (data: PRBubbleCreate) => {
    isSaving.value = true;
    error.value = null;
    try {
      const updateData: PRBubbleUpdate = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        link_url: data.link_url,
        tag_type: data.tag_type,
        tag_text: data.tag_text,
        tag_color: data.tag_color,
        start_date: data.start_date,
        end_date: data.end_date,
        priority: data.priority,
        status: data.status,
        utm_campaign: data.utm_campaign,
      };
      await api.pr.update(prId, updateData);
      await nav("/");
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to update PR";
    } finally {
      isSaving.value = false;
    }
  });

  const formatDateForInput = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div class="animate-fade-in">
      <div class="mb-8">
        <a href="/" class="text-[var(--color-text-muted)] hover:text-white transition-colors">
          ← 一覧に戻る
        </a>
        <h1 class="text-3xl font-bold text-white mt-4">PR枠を編集</h1>
      </div>

      {error.value && (
        <div class="glass-card border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 mb-6">
          <p class="text-[var(--color-error)]">{error.value}</p>
        </div>
      )}

      {isLoading.value && (
        <div class="flex justify-center py-12">
          <div class="spinner" />
        </div>
      )}

      {!isLoading.value && pr.value && (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div class="glass-card p-6">
            <h2 class="text-xl font-semibold text-white mb-6">PR枠の内容</h2>
            <PRForm
              initialData={{
                title: pr.value.title,
                description: pr.value.description,
                image_url: pr.value.image_url,
                link_url: pr.value.link_url,
                tag_type: pr.value.tag_type,
                tag_text: pr.value.tag_text,
                tag_color: pr.value.tag_color,
                start_date: formatDateForInput(pr.value.start_date),
                end_date: formatDateForInput(pr.value.end_date),
                priority: pr.value.priority,
                status: pr.value.status === "inactive" ? "draft" : pr.value.status,
                utm_campaign: pr.value.utm_campaign,
              }}
              onSubmit$={handleSubmit}
              onPreviewChange$={handlePreviewChange}
              isLoading={isSaving.value}
              submitLabel="更新する"
            />
          </div>

          {/* Preview Section */}
          <div class="lg:sticky lg:top-24 lg:self-start">
            <div class="glass-card p-6">
              <h2 class="text-xl font-semibold text-white mb-6">LINEでの見え方</h2>
              <LinePreview
                title={previewTitle.value}
                description={previewDescription.value}
                imageUrl={previewImageUrl.value}
                tagText={previewTagText.value}
                tagColor={previewTagColor.value}
              />
            </div>

            {/* Stats */}
            <div class="glass-card p-6 mt-6">
              <h2 class="text-xl font-semibold text-white mb-4">統計</h2>
              <div class="grid grid-cols-2 gap-4">
                <div class="stats-card text-center py-4">
                  <div class="stats-value text-2xl">
                    {pr.value.view_count.toLocaleString()}
                  </div>
                  <div class="stats-label">表示回数</div>
                </div>
                <div class="stats-card text-center py-4">
                  <div class="stats-value text-2xl">
                    {pr.value.click_count.toLocaleString()}
                  </div>
                  <div class="stats-label">クリック数</div>
                </div>
              </div>
              {pr.value.view_count > 0 && (
                <div class="mt-4 text-center">
                  <span class="text-[var(--color-text-muted)]">CTR: </span>
                  <span class="text-[var(--color-primary)] font-semibold">
                    {((pr.value.click_count / pr.value.view_count) * 100).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "PR枠を編集",
  meta: [
    {
      name: "description",
      content: "PR枠を編集",
    },
  ],
};
