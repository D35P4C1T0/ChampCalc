export const HOME_PAGE_STYLES = String.raw`      /* Foundation */
      :root,
      html,
      body {
        background-color: #08121b;
      }

      :root {
        --bg: #08121b;
        --bg-soft: #102130;
        --panel: rgba(10, 22, 34, 0.84);
        --panel-strong: rgba(14, 28, 42, 0.95);
        --line: rgba(166, 191, 214, 0.16);
        --line-strong: rgba(166, 191, 214, 0.28);
        --text: #ecf4fb;
        --muted: #8fa7bc;
        --accent: #67f0c2;
        --accent-strong: #1fd39a;
        --highlight: #ffcf66;
        --danger: #ff7a7a;
        --secondary-accent: #8dc8ff;
        --shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
        --radius-xl: 28px;
        --radius-lg: 20px;
        --radius-md: 16px;
        --radius-sm: 12px;
        --content-width: 72rem;
        --font-display: "Avenir Next", "Futura", "Trebuchet MS", sans-serif;
        --font-body: "Avenir Next", "Segoe UI", sans-serif;
        --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
        --ease-spring-soft: cubic-bezier(0.2, 0.9, 0.24, 1);
        --motion-fast: 180ms;
        --motion-medium: 260ms;
        --motion-slow: 420ms;
      }

      * {
        box-sizing: border-box;
      }

      html {
        height: 100%;
        min-height: 100%;
        background-color: #08121b;
        background:
          radial-gradient(circle at top left, rgba(31, 211, 154, 0.2), transparent 32%),
          radial-gradient(circle at top right, rgba(141, 200, 255, 0.18), transparent 36%),
          linear-gradient(180deg, #08121b 0%, #091823 42%, #071018 100%);
      }

      body {
        margin: 0;
        min-height: 100%;
        min-height: 100vh;
        min-height: 100svh;
        overflow-x: hidden;
        overscroll-behavior-y: none;
        color: var(--text);
        font-family: var(--font-body);
        background-color: #08121b;
        background:
          radial-gradient(circle at 10% 20%, rgba(255, 207, 102, 0.08), transparent 18%),
          radial-gradient(circle at 85% 12%, rgba(103, 240, 194, 0.12), transparent 22%);
      }

      body::after {
        content: "";
        position: fixed;
        inset: -25svh 0;
        pointer-events: none;
        z-index: -1;
        background:
          radial-gradient(circle at top left, rgba(31, 211, 154, 0.2), transparent 32%),
          radial-gradient(circle at top right, rgba(141, 200, 255, 0.18), transparent 36%),
          linear-gradient(180deg, #08121b 0%, #091823 42%, #071018 100%);
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.35), transparent 75%);
      }

      .page {
        width: min(calc(100% - 1rem), var(--content-width));
        margin: 0 auto;
        min-height: 100svh;
        padding:
          max(0.5rem, env(safe-area-inset-top))
          0
          0;
      }

      .shell {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: var(--radius-xl);
        background: linear-gradient(180deg, rgba(14, 28, 42, 0.94), rgba(8, 18, 27, 0.98));
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
      }

      .shell::before,
      .shell::after {
        content: "";
        position: absolute;
        pointer-events: none;
        border-radius: 999px;
        filter: blur(22px);
      }

      .shell::before {
        top: -4rem;
        right: -4rem;
        width: 12rem;
        height: 12rem;
        background: rgba(103, 240, 194, 0.18);
      }

      .shell::after {
        left: -4rem;
        bottom: -6rem;
        width: 14rem;
        height: 14rem;
        background: rgba(141, 200, 255, 0.12);
      }

      /* Hero */
      .hero {
        position: relative;
        padding: 0.9rem 0.8rem 0.75rem;
      }

      .hero-head {
        display: grid;
        gap: 0.75rem;
        position: relative;
        z-index: 7;
      }

      .hero-copy {
        display: grid;
        gap: 0.7rem;
        min-width: 0;
      }

      .hero-subtitle {
        display: block;
      }

      .top-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .action-menu {
        position: relative;
      }

      .action-menu[data-open="true"] {
        z-index: 8;
      }

      .action-trigger {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.72rem 0.9rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        font: inherit;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .action-trigger:focus-visible {
        outline: 2px solid var(--secondary-accent);
        outline-offset: 3px;
      }

      .action-caret {
        color: var(--muted);
        font-size: 0.72rem;
        transition: transform var(--motion-medium) var(--ease-out-soft);
      }

      .action-panel {
        display: none;
        position: absolute;
        top: calc(100% + 0.35rem);
        left: 0;
        z-index: 6;
        gap: 0.6rem;
        min-width: 14rem;
        padding: 0.8rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--panel-strong);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
        will-change: opacity, transform;
      }

      .action-menu.align-right .action-panel {
        left: auto;
        right: 0;
      }

      .action-menu[data-open="true"] .action-panel {
        display: grid;
      }

      .action-menu[data-open="true"] .action-caret {
        transform: rotate(180deg);
      }

      .action-panel h3 {
        margin: 0;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      .action-copy {
        margin-top: 0;
        margin-bottom: 0;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .action-link {
        display: inline-flex;
        align-items: center;
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid rgba(236, 244, 251, 0.22);
        line-height: 1.1;
        transition:
          color var(--motion-fast) ease,
          border-color var(--motion-fast) ease;
      }

      .action-link:hover {
        color: var(--secondary-accent);
        border-color: rgba(141, 200, 255, 0.5);
      }

      .action-copy.muted {
        color: var(--muted);
        font-size: 0.88rem;
        font-weight: 500;
      }

      .action-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .hero h1 {
        margin: 0;
        max-width: 12ch;
        font-family: var(--font-display);
        font-size: clamp(2.1rem, 9vw, 5rem);
        line-height: 0.94;
        letter-spacing: -0.06em;
      }

      .hero p {
        margin: 0;
        max-width: 34rem;
        color: var(--muted);
        font-size: 0.94rem;
        line-height: 1.5;
      }

      .hero-grid {
        display: grid;
        gap: 0.7rem;
        margin-top: 0.6rem;
      }

      /* Shared surfaces */
      .summary-card,
      .calculator {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .summary-card {
        backdrop-filter: blur(14px);
        padding: 0.72rem;
      }

      .summary-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.42rem;
        color: var(--muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .summary-value {
        display: flex;
        align-items: baseline;
        gap: 0.45rem;
      }

      .summary-value strong {
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 9.4vw, 3.3rem);
        line-height: 0.95;
        letter-spacing: -0.08em;
      }

      .summary-value span {
        color: var(--muted);
        font-size: 0.84rem;
      }

      .progress {
        position: relative;
        height: 0.74rem;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(143, 167, 188, 0.16);
      }

      .progress > span {
        position: absolute;
        inset: 0 auto 0 0;
        width: 0%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--accent), var(--highlight));
        transition:
          width 260ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 260ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .summary-meta {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.42rem;
        color: var(--muted);
        font-size: 0.74rem;
      }

      .budget-bar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.38rem;
        color: var(--muted);
        font-size: 0.71rem;
      }

      .app {
        position: relative;
        padding: 0 0.8rem 0.8rem;
      }

      .calculator {
        padding: 0.72rem;
      }

      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.55rem;
      }

      .section-head > :first-child {
        flex: 1 1 auto;
        min-width: 0;
      }

      .section-head h2 {
        margin: 0;
        font-size: 0.94rem;
      }

      .section-head p {
        margin: 0.22rem 0 0;
        color: var(--muted);
        font-size: 0.76rem;
        line-height: 1.28;
      }

      .stat-grid {
        display: grid;
        gap: 0.48rem;
        margin-top: 0.56rem;
      }

      .setup-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(9.5rem, 0.72fr);
        gap: 0.48rem;
        margin-bottom: 0.5rem;
      }

      .setup-field {
        display: grid;
        gap: 0.22rem;
        min-width: 0;
      }

      .setup-label {
        color: var(--muted);
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .setup-input,
      .setup-select {
        width: 100%;
        min-height: 2.42rem;
        margin: 0;
        padding: 0.56rem 0.72rem;
        border: 1px solid var(--line);
        border-radius: 0.9rem;
        outline: none;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        font: 500 0.88rem/1.2 "SFMono-Regular", "Menlo", "Consolas", monospace;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
        text-transform: none;
        text-rendering: geometricPrecision;
        unicode-bidi: plaintext;
        -webkit-font-smoothing: antialiased;
        letter-spacing: normal;
        word-spacing: normal;
      }

      .setup-input::placeholder {
        color: rgba(143, 167, 188, 0.82);
      }

      .setup-input:focus,
      .setup-select:focus {
        border-color: rgba(103, 240, 194, 0.42);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
      }

      .setup-select {
        appearance: none;
        background-image:
          linear-gradient(45deg, transparent 50%, rgba(236, 244, 251, 0.8) 50%),
          linear-gradient(135deg, rgba(236, 244, 251, 0.8) 50%, transparent 50%);
        background-position:
          calc(100% - 1.1rem) calc(50% - 0.15rem),
          calc(100% - 0.8rem) calc(50% - 0.15rem);
        background-size: 0.38rem 0.38rem, 0.38rem 0.38rem;
        background-repeat: no-repeat;
        padding-right: 2.1rem;
      }

      .picker {
        position: relative;
      }

      .picker-row {
        display: flex;
        align-items: center;
        gap: 0.48rem;
        min-width: 0;
      }

      .picker-row .picker {
        flex: 1 1 auto;
        min-width: 0;
      }

      .pokemon-selected-sprite-shell {
        display: none;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border: 1px solid rgba(166, 191, 214, 0.24);
        border-radius: 999px;
        background: rgba(8, 18, 27, 0.78);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.06),
          0 10px 22px rgba(0, 0, 0, 0.18);
        flex: 0 0 auto;
      }

      .pokemon-selected-sprite-shell[data-visible="true"] {
        display: inline-flex;
      }

      .pokemon-selected-sprite {
        width: 2.4rem;
        height: 2.4rem;
        object-fit: contain;
        image-rendering: pixelated;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.22));
      }

      .picker-menu {
        display: none;
        position: absolute;
        top: calc(100% + 0.28rem);
        left: 0;
        right: 0;
        z-index: 9;
        max-height: 16rem;
        overflow: auto;
        padding: 0.3rem;
        border: 1px solid var(--line);
        border-radius: 0.95rem;
        background: rgba(10, 22, 34, 0.98);
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
      }

      .picker[data-open="true"] .picker-menu {
        display: grid;
        gap: 0.18rem;
      }

      .picker-empty {
        padding: 0.58rem 0.64rem;
        color: var(--muted);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .picker-option {
        width: 100%;
        min-height: 0;
        padding: 0.52rem 0.6rem;
        border: 0;
        border-radius: 0.72rem;
        background: transparent;
        color: var(--text);
        font: 500 0.83rem/1.25 "SFMono-Regular", "Menlo", "Consolas", monospace;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
        text-align: left;
        box-shadow: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: none;
        text-rendering: geometricPrecision;
        unicode-bidi: plaintext;
        -webkit-font-smoothing: antialiased;
        letter-spacing: normal;
        word-spacing: normal;
      }

      .picker-option:hover,
      .picker-option[data-active="true"] {
        background: rgba(255, 255, 255, 0.08);
        box-shadow: none;
        transform: none;
      }

      .showdown-import-bar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.7rem;
      }

      .showdown-import-btn {
        min-width: 11.4rem;
        flex: 0 0 auto;
      }

      .showdown-import-status {
        display: inline-block;
        order: -1;
        color: var(--muted);
        font-size: 0.8rem;
        font-weight: 700;
        text-align: right;
        min-width: 0;
        max-width: min(20rem, 42vw);
      }

      .showdown-import-status.warning {
        color: var(--danger);
      }

      .showdown-import-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: "SFMono-Regular", "Menlo", "Consolas", monospace;
        font-weight: 500;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
        text-transform: none;
        text-rendering: geometricPrecision;
        unicode-bidi: plaintext;
        -webkit-font-smoothing: antialiased;
      }

      .showdown-preview,
      .modal-textarea {
        min-height: 10.5rem;
        resize: vertical;
        font: 600 0.82rem/1.45 "SFMono-Regular", "Menlo", "Consolas", monospace;
      }

      /* Calculator */
      .showdown-preview {
        font-variant-ligatures: none;
      }

      .stat-card {
        display: grid;
        grid-template-columns: minmax(5.2rem, auto) minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.34rem 0.62rem;
        padding: 0.5rem 0.56rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent),
          rgba(255, 255, 255, 0.015);
        transition:
          border-color var(--motion-fast) ease,
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .stat-card:focus-within {
        border-color: var(--line-strong);
        transform: translateY(-2px);
        background:
          linear-gradient(180deg, rgba(103, 240, 194, 0.07), transparent),
          rgba(255, 255, 255, 0.02);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
      }

      .stat-info {
        display: grid;
        gap: 0.18rem;
        min-width: 0;
      }

      .stat-value-wrap {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        min-width: 0;
      }

      .stat-name {
        display: inline-flex;
        align-items: center;
        gap: 0.28rem;
        font-size: 0.84rem;
        font-weight: 700;
        cursor: pointer;
        letter-spacing: -0.01em;
      }

      .stat-nature-indicator {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1em;
        color: var(--muted);
        font-size: 0.68rem;
        line-height: 1;
        opacity: 0;
        transform: translateY(1px);
        transition:
          opacity var(--motion-fast) ease,
          color var(--motion-fast) ease,
          transform var(--motion-fast) ease;
      }

      .stat-nature-indicator[data-state="up"] {
        color: var(--accent);
        opacity: 1;
      }

      .stat-nature-indicator[data-state="down"] {
        color: #ff9a9a;
        opacity: 1;
      }

      .stat-base {
        color: var(--muted);
        font-size: 0.62rem;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .ev-editor {
        position: relative;
        display: inline-grid;
        min-width: 4.25rem;
      }

      .ev-pill {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.24rem;
        min-height: auto;
        padding: 0.22rem 0.46rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.66rem;
        font-weight: 700;
        box-shadow: none;
        cursor: text;
      }

      .ev-pill:hover {
        transform: none;
        box-shadow: none;
        border-color: var(--line-strong);
        background: rgba(255, 255, 255, 0.06);
      }

      .ev-pill:focus-visible {
        outline: 2px solid rgba(141, 200, 255, 0.55);
        outline-offset: 2px;
      }

      .sp-pill {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.24rem;
        min-height: auto;
        min-width: 3.9rem;
        padding: 0.22rem 0.46rem;
        border: 1px solid rgba(103, 240, 194, 0.2);
        border-radius: 999px;
        background: rgba(103, 240, 194, 0.08);
        color: rgba(236, 244, 251, 0.74);
        font-size: 0.66rem;
        font-weight: 700;
        box-shadow: none;
        cursor: default;
        user-select: none;
      }

      .ev-pill strong {
        color: var(--text);
        font-size: 0.78rem;
        font-variant-numeric: tabular-nums;
      }

      .sp-pill strong {
        color: var(--accent);
        font-size: 0.78rem;
        font-variant-numeric: tabular-nums;
      }

      .ev-edit {
        position: absolute;
        inset: 0;
        width: 100%;
        margin: 0;
        padding: 0.22rem 0.46rem;
        border: 1px solid rgba(103, 240, 194, 0.34);
        border-radius: 999px;
        outline: none;
        background: rgba(3, 10, 16, 0.92);
        color: var(--text);
        font: 700 0.78rem/1 var(--font-body);
        font-variant-numeric: tabular-nums;
        text-align: center;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.98);
        transition:
          opacity var(--motion-fast) ease,
          transform var(--motion-fast) ease,
          border-color var(--motion-fast) ease,
          box-shadow var(--motion-fast) ease;
      }

      .ev-edit:focus {
        border-color: rgba(103, 240, 194, 0.52);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
      }

      .ev-edit::-webkit-outer-spin-button,
      .ev-edit::-webkit-inner-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }

      .ev-editor[data-editing="true"] .ev-pill {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.98);
      }

      .ev-editor[data-editing="true"] .ev-edit {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
      }

      .slider-wrap {
        display: grid;
        gap: 0.18rem;
        min-width: 0;
      }

      .stat-card input {
        width: 100%;
        margin: 0;
        accent-color: var(--accent);
      }

      .stat-card input:focus {
        outline: none;
      }

      .stat-card input[type="range"] {
        height: 1.45rem;
        background: transparent;
        --ratio: 0;
      }

      .stat-card input[type="range"]::-webkit-slider-runnable-track {
        height: 0.44rem;
        border-radius: 999px;
        background:
          linear-gradient(
            90deg,
            #1e86ff 0%,
            #1e86ff calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) 100%
          );
      }

      .stat-card input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.18rem;
        height: 1.18rem;
        margin-top: -0.37rem;
        border: 3px solid #f5f8fc;
        border-radius: 50%;
        background: #727284;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.26);
      }

      .stat-card input[type="range"]::-moz-range-track {
        height: 0.44rem;
        border: 0;
        border-radius: 999px;
        background:
          linear-gradient(
            90deg,
            #1e86ff 0%,
            #1e86ff calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) 100%
          );
      }

      .stat-card input[type="range"]::-moz-range-thumb {
        width: 1.18rem;
        height: 1.18rem;
        border: 3px solid #f5f8fc;
        border-radius: 50%;
        background: #727284;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.26);
      }

      .slider-scale {
        display: flex;
        justify-content: space-between;
        color: var(--muted);
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
      }

      .stat-card output {
        min-width: 2ch;
        font-family: var(--font-display);
        font-size: 1.18rem;
        letter-spacing: -0.04em;
        font-variant-numeric: tabular-nums;
        text-align: right;
      }

      .toolbar {
        display: grid;
        gap: 0.5rem;
        margin-top: 0.55rem;
      }

      .button-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: min(100%, 20.5rem);
        gap: 0.6rem;
        justify-self: end;
      }

      button,
      .share-link {
        appearance: none;
        border: 0;
        border-radius: 999px;
        min-height: 2.72rem;
        padding: 0.72rem 0.88rem;
        font: inherit;
        font-weight: 700;
        font-size: 0.92rem;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          opacity var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      button:hover,
      .share-link:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
      }

      .primary-btn {
        color: #062019;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .ghost-btn,
      .share-link {
        color: var(--text);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.04);
      }

      .ghost-btn.danger {
        color: #ffd7d7;
        border-color: rgba(255, 122, 122, 0.36);
        background: rgba(255, 122, 122, 0.12);
      }

      .ghost-btn.danger:hover {
        border-color: rgba(255, 122, 122, 0.52);
        background: rgba(255, 122, 122, 0.18);
      }

      .share-link[hidden] {
        display: none;
      }

      .chip,
      .footer-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 3rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        font-weight: 700;
        text-decoration: none;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft),
          color var(--motion-medium) var(--ease-out-soft);
      }

      .chip {
        gap: 0.45rem;
        padding: 0.48rem 0.7rem;
        color: var(--muted);
        font-size: 0.82rem;
      }

      .chip svg {
        width: 1rem;
        height: 1rem;
        fill: currentColor;
      }

      .paypal-mark {
        display: block;
        width: 1.08rem;
        height: 1.08rem;
        overflow: visible;
        shape-rendering: geometricPrecision;
      }

      .chip.icon-only {
        width: 3rem;
        min-width: 3rem;
        padding: 0;
      }

      .chip:hover,
      .footer-link:hover {
        transform: translateY(-1px);
        border-color: var(--line-strong);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.14);
      }

      .chip.primary {
        color: #062019;
        border-color: transparent;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .footer-link {
        padding: 0.85rem 1rem;
        color: var(--text);
      }

      .footer-link.primary {
        border: 0;
        color: #062019;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .footer-link.icon-only {
        width: 3rem;
        min-width: 3rem;
        padding: 0;
      }

      .footer-link.icon-only svg {
        width: 1.1rem;
        height: 1.1rem;
        fill: currentColor;
      }

      .help-fab {
        position: absolute;
        left: 0.9rem;
        bottom: 0.9rem;
        z-index: 5;
        width: 3rem;
        min-width: 3rem;
        min-height: 3rem;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(10, 22, 34, 0.9);
        color: var(--text);
        box-shadow: 0 18px 38px rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(14px);
      }

      .help-fab:hover {
        border-color: var(--line-strong);
        background: rgba(18, 33, 48, 0.96);
      }

      .help-fab span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 1rem;
        font-weight: 800;
        line-height: 1;
      }

      .tips-list {
        margin: 0;
        padding-left: 1.1rem;
        color: var(--muted);
        display: grid;
        gap: 0.5rem;
        font-size: 0.88rem;
        line-height: 1.5;
      }

      /* Dialogs */
      .reset-modal {
        width: min(calc(100% - 1.5rem), 24rem);
        margin: auto;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: linear-gradient(180deg, rgba(14, 28, 42, 0.98), rgba(8, 18, 27, 0.98));
        color: var(--text);
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.4);
        opacity: 0;
        transform: translateY(18px) scale(0.975);
        transition:
          opacity var(--motion-medium) var(--ease-out-soft),
          transform var(--motion-medium) var(--ease-spring-soft);
        will-change: opacity, transform;
      }

      .reset-modal::backdrop {
        background: rgba(3, 10, 16, 0.72);
        backdrop-filter: blur(8px);
        animation: modal-backdrop-out var(--motion-fast) ease forwards;
      }

      .reset-modal-content {
        display: grid;
        gap: 0.8rem;
        padding: 1rem;
        opacity: 0;
        transform: translateY(10px);
        transition:
          opacity var(--motion-medium) var(--ease-out-soft),
          transform var(--motion-medium) var(--ease-spring-soft);
      }

      .reset-modal h3 {
        margin: 0;
        font-size: 1rem;
        letter-spacing: -0.03em;
      }

      .reset-modal p {
        margin: 0;
        color: var(--muted);
        line-height: 1.5;
      }

      .modal-field {
        display: grid;
        gap: 0.45rem;
      }

      .modal-label {
        color: var(--muted);
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .modal-input {
        width: 100%;
        margin: 0;
        padding: 0.82rem 0.9rem;
        border: 1px solid rgba(103, 240, 194, 0.26);
        border-radius: var(--radius-sm);
        outline: none;
        background: rgba(3, 10, 16, 0.86);
        color: var(--text);
        font: 700 1rem/1.1 var(--font-body);
        font-variant-numeric: tabular-nums;
      }

      .modal-input:focus {
        border-color: rgba(103, 240, 194, 0.52);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
      }

      .modal-input::-webkit-outer-spin-button,
      .modal-input::-webkit-inner-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }

      .modal-toggle-group {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .modal-toggle {
        min-height: 2.65rem;
        padding: 0.62rem 0.75rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        box-shadow: none;
      }

      .modal-toggle[data-active="true"] {
        color: #062019;
        border-color: transparent;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .modal-toggle:hover {
        box-shadow: none;
      }

      .modal-note {
        color: var(--muted);
        font-size: 0.78rem;
        line-height: 1.45;
      }

      .modal-help {
        position: relative;
        flex: 0 0 auto;
      }

      .modal-toggle-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.6rem;
      }

      .modal-help-trigger {
        min-height: 2rem;
        width: 2rem;
        min-width: 2rem;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.92rem;
        font-weight: 800;
        line-height: 1;
        box-shadow: none;
      }

      .modal-help-trigger:hover,
      .modal-help-trigger:focus-visible {
        color: var(--text);
        border-color: var(--line-strong);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      .modal-help-panel {
        position: absolute;
        right: 0;
        top: calc(100% + 0.55rem);
        width: min(18rem, calc(100vw - 2rem));
        padding: 0.75rem 0.8rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(10, 22, 34, 0.98);
        box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
        opacity: 0;
        transform: translateY(-4px) scale(0.985);
        pointer-events: none;
        transition:
          opacity var(--motion-medium) var(--ease-out-soft),
          transform var(--motion-medium) var(--ease-spring-soft);
      }

      .modal-help:hover .modal-help-panel,
      .modal-help:focus-within .modal-help-panel {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .reset-modal-actions {
        display: grid;
        gap: 0.6rem;
      }

      .reset-modal[open][data-visible="true"] {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .reset-modal[open][data-visible="true"] .reset-modal-content {
        opacity: 1;
        transform: translateY(0);
      }

      .reset-modal[open][data-visible="true"]::backdrop {
        animation: modal-backdrop-in var(--motion-medium) var(--ease-out-soft) forwards;
      }

      @media (hover: hover) and (pointer: fine) {
        .summary-card:hover,
        .calculator:hover {
          transform: translateY(-1px);
          border-color: var(--line-strong);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.14);
        }

        .action-panel {
          display: grid;
          position: absolute;
          top: calc(100% + 0.35rem);
          left: 0;
          z-index: 6;
          opacity: 0;
          transform: translateY(-6px) scale(0.985);
          pointer-events: none;
          transition:
            opacity var(--motion-medium) var(--ease-out-soft),
            transform var(--motion-medium) var(--ease-spring-soft);
          transform-origin: top left;
        }

        .action-menu.align-right .action-panel {
          left: auto;
          right: 0;
          transform-origin: top right;
        }

        .action-menu[data-open="true"] .action-panel {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .action-menu[data-open="true"] .action-trigger {
          transform: translateY(-1px);
          border-color: var(--line-strong);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
        }

        .action-menu[data-open="true"] .action-caret {
          transform: rotate(180deg);
        }
      }

      .warning {
        color: var(--danger);
      }

      @supports (padding: max(0px)) {
        .page {
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
        }
      }

      .reveal {
        opacity: 0;
        transform: translateY(14px) scale(0.988);
        animation: rise 760ms var(--ease-out-soft) forwards;
        animation-delay: var(--delay, 0ms);
        will-change: opacity, transform;
      }

      @keyframes rise {
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes modal-backdrop-in {
        from {
          background: rgba(3, 10, 16, 0);
          backdrop-filter: blur(0);
        }

        to {
          background: rgba(3, 10, 16, 0.72);
          backdrop-filter: blur(8px);
        }
      }

      @keyframes modal-backdrop-out {
        from {
          background: rgba(3, 10, 16, 0.72);
          backdrop-filter: blur(8px);
        }

        to {
          background: rgba(3, 10, 16, 0);
          backdrop-filter: blur(0);
        }
      }

      /* Responsive */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 1ms !important;
          scroll-behavior: auto !important;
        }
      }

      @media (max-width: 559px) {
        .page {
          width: 100%;
          padding:
            env(safe-area-inset-top)
            0
            0;
        }

        .shell {
          border-left: 0;
          border-right: 0;
          border-bottom: 0;
          border-radius: 0;
          box-shadow: none;
        }

        .hero {
          padding: 0.68rem 0.78rem 0.48rem;
        }

        .hero-head {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 0.52rem 0.72rem;
        }

        .hero h1 {
          font-size: clamp(1.4rem, 6.8vw, 1.95rem);
          line-height: 0.98;
        }

        .hero-subtitle {
          display: none;
        }

        .top-actions {
          justify-self: end;
          align-self: start;
        }

        .hero-grid {
          position: sticky;
          top: max(0.35rem, env(safe-area-inset-top));
          z-index: 3;
          margin-top: 0.55rem;
        }

        .summary-card {
          padding: 0.76rem 0.8rem;
          border-radius: 18px;
          background: rgba(10, 22, 34, 0.92);
        }

        .summary-label {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.35rem 0.6rem;
          margin-bottom: 0.42rem;
          font-size: 0.68rem;
        }

        .summary-value {
          gap: 0.42rem;
        }

        .summary-value strong {
          font-size: clamp(1.6rem, 10vw, 2.1rem);
        }

        .summary-value span {
          font-size: 0.8rem;
        }

        .progress {
          height: 0.72rem;
        }

        .summary-meta,
        .budget-bar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.3rem 0.6rem;
          margin-top: 0.42rem;
          font-size: 0.71rem;
        }

        .summary-meta span:last-child,
        .budget-bar span:last-child {
          text-align: right;
        }

        .app {
          padding: 0 0.78rem 0.78rem;
        }

        .calculator {
          padding: 0.74rem;
          border-radius: 18px;
        }

        .section-head {
          margin-bottom: 0.55rem;
        }

        .section-head h2 {
          font-size: 0.92rem;
        }

        .section-head p {
          display: none;
        }

        .stat-card,
        .action-panel {
          border-radius: 14px;
        }

        .stat-grid {
          gap: 0.56rem;
          margin-top: 0.66rem;
        }

        .stat-card {
          grid-template-columns: minmax(4.8rem, auto) minmax(0, 1fr) auto;
          gap: 0.28rem 0.48rem;
          padding: 0.48rem 0.54rem;
        }

        .stat-info {
          gap: 0.14rem;
        }

        .stat-name {
          font-size: 0.78rem;
        }

        .stat-value-wrap {
          gap: 0.26rem;
        }

        .ev-pill {
          padding: 0.18rem 0.4rem;
          font-size: 0.62rem;
        }

        .sp-pill {
          padding: 0.18rem 0.4rem;
          font-size: 0.62rem;
        }

        .ev-pill strong {
          font-size: 0.72rem;
        }

        .sp-pill strong {
          font-size: 0.72rem;
        }

        .stat-card output {
          font-size: 1rem;
        }

        .slider-wrap {
          gap: 0.14rem;
        }

        .slider-scale {
          font-size: 0.56rem;
        }

        .stat-card input[type="range"] {
          height: 1.28rem;
        }

        .stat-card input[type="range"]::-webkit-slider-runnable-track,
        .stat-card input[type="range"]::-moz-range-track {
          height: 0.38rem;
        }

        .stat-card input[type="range"]::-webkit-slider-thumb,
        .stat-card input[type="range"]::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
        }

        .toolbar {
          gap: 0.5rem;
          margin-top: 0.62rem;
        }

        .setup-grid {
          grid-template-columns: 1fr;
          gap: 0.56rem;
        }

        .picker-row {
          position: relative;
          align-items: stretch;
        }

        .picker-row .picker {
          position: static;
        }

        .picker-menu {
          left: 0;
          right: 0;
          width: auto;
          max-width: 100%;
        }

        .picker-option {
          padding: 0.58rem 0.64rem;
          white-space: normal;
          overflow: visible;
          text-overflow: clip;
          line-height: 1.3;
        }

        .showdown-import-bar {
          align-items: stretch;
          flex-direction: column;
          justify-content: flex-start;
          width: 100%;
          margin-top: 0.2rem;
        }

        .showdown-import-btn {
          min-width: 0;
          width: 100%;
        }

        .showdown-import-status {
          display: none;
        }

        .button-row {
          gap: 0.5rem;
        }

        button,
        .share-link,
        .footer-link {
          min-height: 2.75rem;
          padding: 0.74rem 0.85rem;
          font-size: 0.88rem;
        }

        .top-actions {
          display: grid;
          gap: 0.55rem;
          position: relative;
          z-index: 6;
        }

        .action-trigger {
          width: 100%;
          justify-content: space-between;
          font-size: 0.74rem;
        }

        .action-panel {
          width: min(16rem, calc(100vw - 1.3rem));
          min-width: 0;
        }

        .reset-modal-content {
          padding: 0.9rem;
        }

        .help-fab {
          left: 0.78rem;
          bottom: 0.78rem;
          width: 2.8rem;
          min-width: 2.8rem;
          min-height: 2.8rem;
        }
      }

      @media (max-width: 820px) {
        .action-caret {
          display: none;
        }

        .top-actions {
          grid-template-columns: repeat(2, auto);
          justify-content: end;
        }

        .action-trigger {
          min-width: 3.1rem;
          min-height: 3.1rem;
          padding: 0.6rem 0.72rem;
          justify-content: center;
          border-radius: 1rem;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }
      }

      @media (min-width: 760px) {
        .page {
          width: min(calc(100% - 1.5rem), var(--content-width));
          padding:
            max(0.9rem, env(safe-area-inset-top))
            0
            0;
        }

        .hero {
          padding: 1.6rem 1.4rem 1rem;
        }

        .hero-head {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 1rem;
        }

        .app {
          padding-left: 1.4rem;
          padding-right: 1.4rem;
        }

        .summary-card {
          min-height: 100%;
          padding: 0.82rem 0.88rem;
        }

        .summary-label {
          margin-bottom: 0.5rem;
        }

        .summary-value strong {
          font-size: clamp(1.8rem, 4.6vw, 2.6rem);
        }

        .summary-value span {
          font-size: 0.82rem;
        }

        .summary-meta,
        .budget-bar {
          margin-top: 0.46rem;
        }

        .calculator {
          padding: 0.84rem 0.88rem 0.88rem;
        }

        .section-head {
          margin-bottom: 0.7rem;
        }

        .stat-grid {
          grid-template-columns: 1fr 1fr;
          gap: 0.62rem;
          margin-top: 0.68rem;
        }

        .stat-card {
          grid-template-columns: minmax(5rem, auto) minmax(0, 1fr) auto;
          gap: 0.32rem 0.62rem;
          padding: 0.56rem 0.62rem;
        }

        .stat-info {
          gap: 0.16rem;
        }

        .toolbar {
          grid-template-columns: 1fr auto;
          align-items: center;
        }

        .button-row {
          width: 100%;
          max-width: 21.5rem;
        }

        .top-actions {
          display: flex;
          gap: 0.7rem;
          justify-content: flex-end;
          align-self: start;
        }

        .action-trigger {
          width: auto;
          justify-content: flex-start;
          font-size: 0.78rem;
        }

        .action-panel {
          margin-top: 0;
        }
      }`;
