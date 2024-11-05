import styles from './styles.js';

class MyCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets.push(styles);
    shadow.innerHTML = `
      <div part="panel" class="relative p-16 rounded-8 s-border border-2 s-bg-positive">
        <div part="header" class="font-bold text-l">Card Header</div>
        <div part="content" class="text-subtle"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define('my-card', MyCard);