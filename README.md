
# UnoCSS on custom-elements POC

This proof-of-concept (POC) demonstrates the use of UnoCSS for generating modular, component-specific CSS files that are injected directly into web components at build time. The objective is to produce standalone, self-contained component files within `dist`, independent of UnoCSS at runtime. In this example the main doc is treated in a similar fashion, but that was just a matter of efficiency setting up the poc, it should rather just be handled as a normal unoCSS setup.


## Key Features

- **Component-Specific CSS**: UnoCSS scans each component file, generates the necessary CSS, and outputs it to a standalone file (e.g., `my-panel.css`) in `dist`.
- **Constructed Stylesheets**: Components use Constructed Stylesheets for shared styling, allowing reusable, performance-optimized styling across multiple components in the Shadow DOM.
- **Light DOM and Shadow DOM Preflight Styling**: Preflight styles in the Light DOM prevent FOUC (Flash of Unstyled Content) and provide consistent initial styling across components.
- **Shadow DOM Reset**: A custom lightweight reset (`shadowreset.css`) provides essential styling to maintain consistency within each component’s Shadow DOM.

## Project Structure

```
project-root/
├── src/
│   └── components/
│       ├── my-card/
│       │   ├── my-card.js
│       │   ├── styles.js
│       │   └── preflight.css
│       └── my-panel/
│           ├── my-panel.js
│           ├── styles.js
│           └── preflight.css
├── dist/
│   └── components/
│       ├── my-card.js (with injected CSS)
│       ├── my-card.css
│       ├── my-panel.js (with injected CSS)
│       └── my-panel.css
├── inject-css.js
├── uno.config.preflight.js
├── uno.config.light.js
├── uno.config.components.js
├── shadowreset.css
└── index.html
```

## Updated Component Example

### `my-panel.js`

This component imports `styles.js` and applies the stylesheet to its Shadow DOM using `adoptedStyleSheets`. This setup enables sharing a common reset (`shadowreset.css`) and component-specific styles across components.

```javascript
import styles from './styles.js';

class MyPanel extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [styles];
    shadow.innerHTML = `
      <div part="panel" class="relative p-16 rounded-8 s-border border-2">
        <div part="header" class="font-bold text-l">Panel Header</div>
        <div part="content" class="s-text-subtle"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define('my-panel', MyPanel);
```

### `styles.js`

In `styles.js`, placeholders `@shadowReset;` and `@styles;` are replaced at build time with actual CSS content from `shadowreset.css` and `my-panel.css`, respectively.

```javascript
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  @shadowReset;
  @styles;
`);
export default sheet;
```

## `inject-css.js` Script

The `inject-css.js` script automates CSS injection by replacing placeholders (`@shadowReset;` and `@styles;`) in each component’s `styles.js` file with the actual CSS content, creating fully self-contained files in `dist/components`.

1. **Copies component files from `src/components` to `dist/components`**.
2. **Replaces placeholders in `styles.js`** with actual CSS content from `shadowreset.css` and each component’s specific CSS file.

```javascript
import fs from "fs";
import path from "path";

// Paths
const componentsDir = "./src/components";
const commonDir = "./src/common";
const distDir = "./dist";
const distComponentsDir = "./dist/components";

// Ensure `dist/components` exists
if (!fs.existsSync(distComponentsDir)) {
  fs.mkdirSync(distComponentsDir, { recursive: true });
}

// Convert component folder names to kebab-case if needed
function toKebabCase(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// Function to inject CSS into each component copy in `dist`
function injectCSS() {
  const componentFolders = fs.readdirSync(componentsDir).filter((folder) => {
    const fullPath = path.join(componentsDir, folder);
    return fs.statSync(fullPath).isDirectory();
  });

  componentFolders.forEach((folder) => {
    const kebabName = toKebabCase(folder);
    const componentDir = path.join(componentsDir, folder);
    const componentFile = path.join(componentDir, `${kebabName}.js`);
    const componentStyleFile = path.join(componentDir, `styles.js`);
    const distComponentDir = path.join(distComponentsDir, folder);
    const distComponentFile = path.join(distComponentDir, `${kebabName}.js`);
    const distComponentStyleFile = path.join(distComponentDir, `styles.js`);
    const builtComponentCSSPath = path.join(distDir, `${kebabName}.css`);
    const shadowResetCSSPath = path.join(commonDir, `shadowreset.css`);

    fs.mkdirSync(distComponentDir, { recursive: true });
    fs.copyFileSync(componentFile, distComponentFile);
    fs.copyFileSync(componentStyleFile, distComponentStyleFile);

    let styleJSCode = fs.readFileSync(distComponentStyleFile, "utf8");
    let shadowResetCSS = fs.readFileSync(shadowResetCSSPath, "utf8");
    let builtComponentCSS = fs.readFileSync(builtComponentCSSPath, "utf8");

    styleJSCode = styleJSCode.replace('@shadowReset;', shadowResetCSS);
    styleJSCode = styleJSCode.replaceAll('@styles;', builtComponentCSS);

    fs.writeFileSync(distComponentStyleFile, styleJSCode, "utf8");
  });
}

injectCSS();
```

## Running the POC

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Build**:
   ```bash
   npm start
   ```

### Result
The `npm start` command:
1. Builds `preflights.css`, `light.css`, and component-specific CSS.
2. Injects all CSS directly into the component files in `dist/components`, creating fully self-contained files.
3. Serves the project locally.

Each component file in `dist/components` is now independent, containing all necessary CSS for runtime, with no reliance on UnoCSS.
