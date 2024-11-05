import fs from "fs";
import path from "path";

// Paths
const componentsDir = "./src/components";
const commonDir = "./src/common";
const distDir = "./dist"; // Output to `dist/components`
const distComponentsDir = "./dist/components"; // Output to `dist/components`

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
