import { component$, Slot } from "@builder.io/qwik";
import { Header } from "~/components/layout/header";

export default component$(() => {
  return (
    <>
      <Header />
      <main class="pt-24 pb-12 px-6 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <Slot />
        </div>
      </main>
    </>
  );
});
