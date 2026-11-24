<script setup>
// The site-search island: the pagefind dialog as a Vue island (the
// site's first). The trigger stays a plain button in the header — the
// island listens for it on the document — while the stateful surface
// (the query, the lazy-loaded index, the results) hydrates client:idle.
import { onBeforeUnmount, onMounted, ref } from "vue";

const dialog = ref(null);
const input = ref(null);
const results = ref(null);

let pagefind = null;
let timer;

async function ensureIndex() {
  if (pagefind) return pagefind;
  try {
    // Opaque path so the bundler never tries to resolve the index at
    // build time — pagefind materializes it in dist/ after the build.
    const url = "/pagefind/pagefind.js";
    pagefind = await import(/* @vite-ignore */ url);
    await pagefind.options({});
  } catch {
    pagefind = null;
  }
  return pagefind;
}

async function run() {
  const el = results.value;
  const q = input.value.value.trim();
  if (!q) {
    el.innerHTML = "";
    return;
  }
  const pf = await ensureIndex();
  if (!pf) {
    el.innerHTML =
      '<p class="search-empty">Search index is not available — build the site first (npm run build), then serve dist/.</p>';
    return;
  }
  const search = await pf.search(q);
  const top = search.results.slice(0, 8);
  if (top.length === 0) {
    el.innerHTML = '<p class="search-empty">No results.</p>';
    return;
  }
  const items = await Promise.all(top.map((r) => r.data()));
  el.innerHTML = items
    .map(
      (d) => `<a class="search-hit" href="${d.url}">
          <span class="search-hit-title">${d.meta.title || d.url}</span>
          <span class="search-hit-excerpt">${d.excerpt}</span>
        </a>`,
    )
    .join("");
}

function onInput() {
  clearTimeout(timer);
  timer = setTimeout(run, 180);
}

function open() {
  dialog.value.showModal();
  input.value.focus();
  ensureIndex();
}

function close() {
  dialog.value.close();
}

function onBackdrop(event) {
  if (event.target === dialog.value) dialog.value.close();
}

function onDocumentClick(event) {
  if (event.target.closest("#search-open")) open();
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  clearTimeout(timer);
});
</script>

<template>
  <dialog
    id="site-search"
    ref="dialog"
    class="search"
    aria-label="Search the site"
    @click="onBackdrop"
  >
    <div class="search-box">
      <div class="search-head">
        <input
          ref="input"
          type="search"
          placeholder="Search unidpp.org"
          autocomplete="off"
          aria-label="Search unidpp.org"
          @input="onInput"
        />
        <button class="search-close" aria-label="Close search" @click="close">
          Esc
        </button>
      </div>
      <div ref="results" class="search-results" aria-live="polite"></div>
    </div>
  </dialog>
</template>

<style>
  /* The dialog's own styles traveled here from the base layout — the
     island owns its surface; the palette stays on the CSS variables. */
  .search {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--bg);
    color: var(--text);
    padding: 0;
    width: min(40rem, calc(100vw - 2rem));
    margin-top: 12vh;
  }
  .search::backdrop {
    background: rgba(15, 20, 32, 0.5);
  }
  .search-box {
    display: flex;
    flex-direction: column;
  }
  .search-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .search-head input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text);
    font: 500 1rem var(--font-sans);
    outline: none;
    min-width: 0;
  }
  .search-head input::placeholder {
    color: var(--text-3);
  }
  .search-close {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-2);
    background: var(--accent-soft);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.3rem 0.6rem;
    cursor: pointer;
  }
  .search-results {
    max-height: 55vh;
    overflow-y: auto;
    padding: 0.4rem;
  }
  .search-empty {
    color: var(--text-2);
    font-size: 0.88rem;
    padding: 0.9rem;
    margin: 0;
  }
  .search-hit {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.6rem 0.7rem;
    border-radius: var(--radius);
    text-decoration: none;
  }
  .search-hit:hover {
    background: var(--accent-soft);
  }
  .search-hit-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text);
  }
  .search-hit-excerpt {
    font-size: 0.8rem;
    color: var(--text-2);
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .search-hit-excerpt mark {
    background: var(--accent-soft);
    color: var(--accent);
    padding: 0 0.1em;
    border-radius: 2px;
  }
</style>
