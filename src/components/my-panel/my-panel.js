import styles from './styles.js';

class MyPanel extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets.push(styles);
    shadow.innerHTML = `
      <div part="panel" class="relative p-16 rounded-8 s-border border-2">
        <div part="header" class="font-bold text-l">Panel Header</div>
        <div part="content" class="s-text-subtle"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define('my-panel', MyPanel);