class MyPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import 'src/common/shadowreset.css';
        @import 'dist/my-panel.css';
      </style>
      <div part="panel" class="relative p-16 rounded-8 s-border border-2">
        <div part="header" class="font-bold text-l">Panel Header</div>
        <div part="content" class="s-text-subtle"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define('my-panel', MyPanel);