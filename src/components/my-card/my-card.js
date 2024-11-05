class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import 'src/common/shadowreset.css';
        @import 'dist/my-card.css';
      </style>
      <div part="panel" class="relative p-16 rounded-8 s-border border-2 s-bg-positive">
        <div part="header" class="font-bold text-l">Card Header</div>
        <div part="content" class="text-subtle"><slot></slot></div>
      </div>

    `;
  }
}

customElements.define('my-card', MyCard);