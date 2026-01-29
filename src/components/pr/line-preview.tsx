import { component$ } from "@builder.io/qwik";

interface LinePreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  tagText: string;
  tagColor: string;
}

export const LinePreview = component$<LinePreviewProps>((props) => {
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='182' viewBox='0 0 280 182'%3E%3Crect fill='%23374151' width='280' height='182'/%3E%3Ctext fill='%239CA3AF' font-family='sans-serif' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div class="line-preview-container">
      <div class="text-center text-white/60 text-sm mb-4">LINE プレビュー</div>
      
      <div class="carousel-container justify-center">
        {/* Left blur card */}
        <div class="carousel-item carousel-item-blur hidden lg:block">
          <div class="line-bubble opacity-50">
            <div class="relative">
              <img
                src={props.imageUrl || placeholderImage}
                alt=""
                class="line-bubble-image"
                width={280}
                height={182}
              />
            </div>
            <div class="line-bubble-body">
              <div class="line-bubble-title truncate">{props.title || "タイトル"}</div>
            </div>
          </div>
        </div>

        {/* Center main card */}
        <div class="carousel-item">
          <div class="line-bubble">
            <div class="relative">
              <img
                src={props.imageUrl || placeholderImage}
                alt={props.title}
                class="line-bubble-image"
                width={280}
                height={182}
              />
              <div
                class="line-bubble-tag"
                style={{ backgroundColor: props.tagColor || "#FF1BE8" }}
              >
                {props.tagText || "GIZMART"}
              </div>
            </div>
            <div class="line-bubble-body">
              <div class="line-bubble-title">
                {props.title || "タイトルを入力してください"}
              </div>
              <div class="line-bubble-description">
                {props.description || "説明文を入力してください"}
              </div>
            </div>
            <div class="line-bubble-footer">
              <span class="line-bubble-button">詳細を見る</span>
            </div>
          </div>
        </div>

        {/* Right blur card */}
        <div class="carousel-item carousel-item-blur hidden lg:block">
          <div class="line-bubble opacity-50">
            <div class="relative">
              <img
                src={props.imageUrl || placeholderImage}
                alt=""
                class="line-bubble-image"
                width={280}
                height={182}
              />
            </div>
            <div class="line-bubble-body">
              <div class="line-bubble-title truncate">{props.title || "タイトル"}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center text-white/40 text-xs mt-4">
        実際のLINEでの表示イメージ
      </div>
    </div>
  );
});
