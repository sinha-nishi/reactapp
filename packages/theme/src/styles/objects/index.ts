import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types";

export const objectsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // Layer name depends on your builder: you said it currently outputs @layer layout.
    // If your builder uses b.objects() -> @layer layout already, keep b.objects.
    // Otherwise swap to b.layout(...) or whatever maps to @layer layout in your system.
    b.objects(
      `
/* ---------------------------
   Layout custom properties
   (override per instance)
   --------------------------- */

/* default spacing used by many layouts */
:where(.stack, .cluster, .grid, .flow, .reel, .switcher, .split, .sidebar, .media) {
  --space: var(--spacing-4);
}

/* ---------------------------
   FLOW: content rhythm (prose blocks)
   --------------------------- */
.flow > * + * {
  margin-top: var(--space);
}

/* ---------------------------
   STACK: vertical layout with configurable spacing
   --------------------------- */
.stack {
  display: flex;
  flex-direction: column;
}
.stack > * + * {
  margin-top: var(--space);
}

/* ---------------------------
   CLUSTER: inline group with wrap (buttons/tags)
   --------------------------- */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
  align-items: center;
}
.cluster--start { justify-content: flex-start; }
.cluster--center { justify-content: center; }
.cluster--end { justify-content: flex-end; }
.cluster--between { justify-content: space-between; }

/* ---------------------------
   GRID: simple grid with configurable min width
   --------------------------- */
.grid {
  display: grid;
  gap: var(--space);
}
.grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Auto-fit grid: set --min per use-case (e.g. 16rem for cards) */
.grid--auto {
  --min: 16rem;
  grid-template-columns: repeat(auto-fit, minmax(min(var(--min), 100%), 1fr));
}

/* ---------------------------
   CONTAINER: page width + padding
   --------------------------- */
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--spacing-4);
  max-width: var(--container, 72rem);
}
.container--sm { --container: 40rem; }
.container--md { --container: 56rem; }
.container--lg { --container: 80rem; }

/* ---------------------------
   CENTER: center children
   --------------------------- */
.center {
  display: grid;
  place-items: center;
}

/* ---------------------------
   MEDIA: figure + body pattern
   --------------------------- */
.media {
  display: flex;
  gap: var(--space);
  align-items: flex-start;
}
.media__figure { flex-shrink: 0; }
.media__body { flex: 1; min-width: 0; }

/* ---------------------------
   SPLIT: two-column layout with responsive wrap
   Use: <div class="split"><div>left</div><div>right</div></div>
   --------------------------- */
.split {
  --split: 18rem;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
  align-items: stretch;
}
.split > * {
  flex: 1 1 var(--split);
  min-width: min(var(--split), 100%);
}
.split--center { align-items: center; }
.split--top { align-items: flex-start; }
.split--bottom { align-items: flex-end; }

/* ---------------------------
   SIDEBAR: aside + main
   Use: <div class="sidebar"><aside>..</aside><main>..</main></div>
   --------------------------- */
.sidebar {
  --sidebar: 16rem;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
  align-items: stretch;
}
.sidebar > :first-child {
  flex-basis: var(--sidebar);
  flex-grow: 1;
}
.sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-width: min(50%, 100%);
}
/* reverse sidebar (main then aside) */
.sidebar--reverse { flex-direction: row-reverse; }

/* ---------------------------
   SWITCHER: responsive columns without media queries
   Great for cards/features.
   --------------------------- */
.switcher {
  --switcher: 48rem;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
}
.switcher > * {
  flex-grow: 1;
  flex-basis: calc((var(--switcher) - 100%) * 999);
  min-width: min(16rem, 100%);
}

/* ---------------------------
   COVER: full-height layout with centered content
   Use:
   <div class="cover">
     <header>...</header>
     <div class="cover__center">...</div>
     <footer>...</footer>
   </div>
   --------------------------- */
.cover {
  --cover-min: 100vh;
  min-block-size: var(--cover-min);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-6);
}
.cover__center {
  margin-block: auto;
}

/* ---------------------------
   FRAME: fixed aspect media (16:9 default)
   --------------------------- */
.frame {
  --ratio: 16 / 9;
  aspect-ratio: var(--ratio);
  overflow: hidden;
  display: grid;
  place-items: center;
}
.frame > * {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

/* ---------------------------
   REEL: horizontal scroll row
   --------------------------- */
.reel {
  display: flex;
  gap: var(--space);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--spacing-2);
}
.reel > * {
  flex: 0 0 auto;
}
`,
      "objects-layout-extended",
    );
  };
