import { component$, Slot, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { Header } from "~/components/layout/header";

export default component$(() => {
  const showOnboarding = useSignal(false);

  useVisibleTask$(() => {
    const hasSeenOnboarding = localStorage.getItem('pr_maker_onboarding_seen');
    if (!hasSeenOnboarding) {
      showOnboarding.value = true;
    }
  });

  const dismissOnboarding = $(() => {
    showOnboarding.value = false;
    localStorage.setItem('pr_maker_onboarding_seen', 'true');
  });

  return (
    <>
      <Header />
      <main class="pt-24 pb-12 px-6 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <Slot />
        </div>
      </main>

      {/* Onboarding Modal */}
      {showOnboarding.value && (
        <div class="onboarding-overlay animate-fade-in">
          <div class="onboarding-card animate-scale-in">
            <div class="onboarding-icon animate-bounce-in">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            
            <h2 class="onboarding-title">Giz PR Maker へようこそ</h2>
            <p class="onboarding-description">
              ダイジェスト配信に載せるPR枠を<br />
              作成・管理できます。
            </p>

            <div class="onboarding-steps">
              <div class="onboarding-step animate-slide-up-delay stagger-1">
                <div class="onboarding-step-number">1</div>
                <div class="onboarding-step-content">
                  <h4>PR枠を作る</h4>
                  <p>タイトル・説明・画像を入力</p>
                </div>
              </div>
              
              <div class="onboarding-step animate-slide-up-delay stagger-2">
                <div class="onboarding-step-number">2</div>
                <div class="onboarding-step-content">
                  <h4>LINEでどう見える？</h4>
                  <p>右側で実際の表示を確認</p>
                </div>
              </div>
              
              <div class="onboarding-step animate-slide-up-delay stagger-3">
                <div class="onboarding-step-number">3</div>
                <div class="onboarding-step-content">
                  <h4>いつ配信する？</h4>
                  <p>下書き→公開中→終了で管理</p>
                </div>
              </div>

              <div class="onboarding-step animate-slide-up-delay stagger-4">
                <div class="onboarding-step-number">4</div>
                <div class="onboarding-step-content">
                  <h4>前のを使い回したい</h4>
                  <p>既存PRをコピーして編集</p>
                </div>
              </div>
            </div>

            <button 
              onClick$={dismissOnboarding}
              class="onboarding-button"
            >
              はじめる
            </button>
          </div>
        </div>
      )}
    </>
  );
});
