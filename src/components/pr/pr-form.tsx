import { component$, useSignal, useTask$, $, useId } from "@builder.io/qwik";
import type { PRBubbleCreate } from "~/lib/api";
import { api } from "~/lib/api";

interface PRFormProps {
  initialData?: Partial<PRBubbleCreate>;
  onSubmit$: (data: PRBubbleCreate) => void;
  onPreviewChange$?: (data: Partial<PRBubbleCreate>) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const PRForm = component$<PRFormProps>((props) => {
  const priorityId = useId();
  const utmCampaignId = useId();
  const title = useSignal(props.initialData?.title || "");
  const description = useSignal(props.initialData?.description || "");
  const imageUrl = useSignal(props.initialData?.image_url || "");
  const linkUrl = useSignal(props.initialData?.link_url || "");
  const tagType = useSignal<"gizmart" | "custom">(props.initialData?.tag_type || "gizmart");
  const tagText = useSignal(props.initialData?.tag_text || "GIZMART");
  const tagColor = useSignal(props.initialData?.tag_color || "#FF1BE8");
  const startDate = useSignal(props.initialData?.start_date || "");
  const endDate = useSignal(props.initialData?.end_date || "");
  const priority = useSignal<string>(props.initialData?.priority?.toString() || "");
  const status = useSignal<"draft" | "active">(
    (props.initialData?.status as "draft" | "active") || "draft"
  );
  const utmCampaign = useSignal(props.initialData?.utm_campaign || "");
  const isUploading = useSignal(false);
  const uploadError = useSignal("");

  const notifyPreviewChange = $(() => {
    if (props.onPreviewChange$) {
      props.onPreviewChange$({
        title: title.value,
        description: description.value,
        image_url: imageUrl.value,
        tag_text: tagText.value,
        tag_color: tagColor.value,
      });
    }
  });

  useTask$(({ track }) => {
    track(() => title.value);
    track(() => description.value);
    track(() => imageUrl.value);
    track(() => tagText.value);
    track(() => tagColor.value);
    notifyPreviewChange();
  });

  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    const data: PRBubbleCreate = {
      title: title.value,
      description: description.value,
      image_url: imageUrl.value,
      link_url: linkUrl.value,
      tag_type: tagType.value,
      tag_text: tagText.value,
      tag_color: tagColor.value,
      start_date: new Date(startDate.value).toISOString(),
      end_date: new Date(endDate.value).toISOString(),
      priority: priority.value ? parseInt(priority.value) : null,
      status: status.value,
      utm_campaign: utmCampaign.value || null,
    };
    props.onSubmit$(data);
  });

  const handleTagTypeChange = $((type: "gizmart" | "custom") => {
    tagType.value = type;
    if (type === "gizmart") {
      tagText.value = "GIZMART";
      tagColor.value = "#FF1BE8";
    }
  });

  const handleFileSelect = $(async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    uploadError.value = "";
    isUploading.value = true;

    try {
      const result = await api.upload.image(file);
      imageUrl.value = result.url;
    } catch (error) {
      uploadError.value = error instanceof Error ? error.message : "Upload failed";
    } finally {
      isUploading.value = false;
      input.value = "";
    }
  });

  const handleUploadZoneClick = $(() => {
    const fileInput = document.getElementById("image-upload-input") as HTMLInputElement;
    fileInput?.click();
  });

  return (
    <form onSubmit$={handleSubmit} class="space-y-6">
      {/* Image Upload */}
      <div class="form-group">
        <label class="form-label">画像</label>
        <input
          type="file"
          id="image-upload-input"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange$={handleFileSelect}
          class="hidden"
        />
        <div 
          class="upload-zone cursor-pointer"
          onClick$={handleUploadZoneClick}
        >
          {isUploading.value ? (
            <div class="text-center py-8">
              <span class="spinner mx-auto mb-4" />
              <p class="text-[var(--color-text-muted)]">アップロード中...</p>
            </div>
          ) : imageUrl.value ? (
            <div class="relative">
              <img
                src={imageUrl.value}
                alt="Preview"
                class="max-h-48 mx-auto rounded-lg"
                width={280}
                height={182}
              />
              <button
                type="button"
                onClick$={(e) => {
                  e.stopPropagation();
                  imageUrl.value = "";
                }}
                class="absolute top-2 right-2 glass-button px-2 py-1 text-xs"
              >
                削除
              </button>
            </div>
          ) : (
            <div class="text-center">
              <svg
                class="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p class="text-[var(--color-text-muted)]">
                画像をクリックしてアップロード
              </p>
              <p class="text-xs text-[var(--color-text-muted)] mt-2">
                JPEG, PNG, GIF, WebP (最大5MB)
              </p>
            </div>
          )}
        </div>
        {uploadError.value && (
          <p class="text-red-500 text-sm mt-2">{uploadError.value}</p>
        )}
        <div class="mt-3">
          <label class="form-label text-sm">または画像URLを入力</label>
          <input
            type="url"
            value={imageUrl.value}
            onInput$={(e) => (imageUrl.value = (e.target as HTMLInputElement).value)}
            placeholder="https://example.com/image.jpg"
            class="glass-input"
          />
        </div>
      </div>

      {/* Title */}
      <div class="form-group">
        <label class="form-label">タイトル</label>
        <input
          type="text"
          value={title.value}
          onInput$={(e) => (title.value = (e.target as HTMLInputElement).value)}
          placeholder="タイトルを入力"
          maxLength={40}
          required
          class="glass-input"
        />
        <div
          class={`char-counter ${
            title.value.length > 35
              ? title.value.length >= 40
                ? "error"
                : "warning"
              : ""
          }`}
        >
          {title.value.length}/40
        </div>
      </div>

      {/* Description */}
      <div class="form-group">
        <label class="form-label">説明文</label>
        <textarea
          value={description.value}
          onInput$={(e) => (description.value = (e.target as HTMLTextAreaElement).value)}
          placeholder="説明文を入力"
          maxLength={100}
          required
          class="glass-textarea"
          rows={3}
        />
        <div
          class={`char-counter ${
            description.value.length > 90
              ? description.value.length >= 100
                ? "error"
                : "warning"
              : ""
          }`}
        >
          {description.value.length}/100
        </div>
      </div>

      {/* Link URL */}
      <div class="form-group">
        <label class="form-label">リンクURL</label>
        <input
          type="url"
          value={linkUrl.value}
          onInput$={(e) => (linkUrl.value = (e.target as HTMLInputElement).value)}
          placeholder="https://example.com/product"
          required
          class="glass-input"
        />
        <p class="form-hint">タップ時の遷移先URL</p>
      </div>

      {/* Tag Settings */}
      <div class="form-group">
        <label class="form-label">タグ設定</label>
        <div class="radio-group mb-4">
          <label class="radio-option">
            <input
              type="radio"
              name="tagType"
              checked={tagType.value === "gizmart"}
              onChange$={() => handleTagTypeChange("gizmart")}
            />
            <span>GIZMART</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              name="tagType"
              checked={tagType.value === "custom"}
              onChange$={() => handleTagTypeChange("custom")}
            />
            <span>カスタム</span>
          </label>
        </div>

        {tagType.value === "custom" && (
          <div class="grid-2">
            <div>
              <label class="form-label text-sm">タグテキスト</label>
              <input
                type="text"
                value={tagText.value}
                onInput$={(e) => (tagText.value = (e.target as HTMLInputElement).value)}
                placeholder="タグテキスト"
                maxLength={50}
                class="glass-input"
              />
            </div>
            <div>
              <label class="form-label text-sm">タグ色</label>
              <div class="color-picker-wrapper">
                <input
                  type="color"
                  value={tagColor.value}
                  onInput$={(e) => (tagColor.value = (e.target as HTMLInputElement).value)}
                  class="color-preview"
                />
                <input
                  type="text"
                  value={tagColor.value}
                  onInput$={(e) => (tagColor.value = (e.target as HTMLInputElement).value)}
                  placeholder="#FF1BE8"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  class="glass-input flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date Range */}
      <div class="form-group">
        <label class="form-label">いつからいつまで配信する？</label>
        <div class="grid-2">
          <div>
            <label class="form-label text-sm">開始日時</label>
            <input
              type="datetime-local"
              value={startDate.value}
              onInput$={(e) => (startDate.value = (e.target as HTMLInputElement).value)}
              required
              class="glass-input"
            />
          </div>
          <div>
            <label class="form-label text-sm">終了日時</label>
            <input
              type="datetime-local"
              value={endDate.value}
              onInput$={(e) => (endDate.value = (e.target as HTMLInputElement).value)}
              required
              class="glass-input"
            />
          </div>
        </div>
      </div>

      {/* Priority */}
      <div class="form-group">
        <label class="form-label" for={priorityId}>表示順</label>
        <input
          type="number"
          id={priorityId}
          value={priority.value}
          onInput$={(e) => (priority.value = (e.target as HTMLInputElement).value)}
          placeholder="1が一番上（未設定可）"
          min={1}
          class="glass-input"
        />
        <p class="form-hint">数値が小さいほど上に表示されます</p>
      </div>

      {/* UTM Campaign */}
      <div class="form-group">
        <label class="form-label" for={utmCampaignId}>計測用タグ</label>
        <input
          type="text"
          id={utmCampaignId}
          value={utmCampaign.value}
          onInput$={(e) => (utmCampaign.value = (e.target as HTMLInputElement).value)}
          placeholder="winter_sale（未設定時は自動生成）"
          class="glass-input"
        />
        <p class="form-hint">アクセス解析で使用</p>
      </div>

      {/* Submit Buttons */}
      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          onClick$={() => (status.value = "draft")}
          class="glass-button flex-1"
          disabled={props.isLoading}
        >
          {props.isLoading ? (
            <span class="flex items-center justify-center gap-2">
              <span class="spinner" />
              保存中...
            </span>
          ) : (
            "下書き保存"
          )}
        </button>
        <button
          type="submit"
          onClick$={() => (status.value = "active")}
          class="glass-button glass-button-primary flex-1"
          disabled={props.isLoading}
        >
          {props.isLoading ? (
            <span class="flex items-center justify-center gap-2">
              <span class="spinner" />
              保存中...
            </span>
          ) : (
            props.submitLabel || "公開する"
          )}
        </button>
      </div>
    </form>
  );
});
