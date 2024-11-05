import fs from 'fs';
import path from 'path';

// Paths
const componentsDir = './src/components';
const distDir = './dist/components'; // Output to `dist/components`

// Ensure `dist/components` exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Convert component folder names to kebab-case if needed
function toKebabCase(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Function to inject CSS into each component copy in `dist`
function injectCSS() {
  const componentFolders = fs.readdirSync(componentsDir).filter((folder) => {
    const fullPath = path.join(componentsDir, folder);
    return fs.statSync(fullPath).isDirectory();
  });

  componentFolders.forEach((folder) => {
    const kebabName = toKebabCase(folder);
    const componentFile = path.join(componentsDir, folder, `${kebabName}.js`);
    const distComponentDir = path.join(distDir, folder);
    const distComponentFile = path.join(distComponentDir, `${kebabName}.js`);

    // Ensure the output directory exists
    fs.mkdirSync(distComponentDir, { recursive: true });

    // Copy component file to `dist/components` directory
    fs.copyFileSync(componentFile, distComponentFile);

    let componentCode = fs.readFileSync(distComponentFile, 'utf8');

    console.log('\x1b[32m%s\x1b[0m', `Building ${distComponentFile}:`);

    // Regex to find all @import statements within <style> tags
    componentCode = componentCode.replace(/<style>([\s\S]*?)<\/style>/g, (match, imports) => {
      return `<style>${imports.replace(/@import\s+['"](.*?)['"];/g, (importStatement, cssPath) => {
        const fullPath = path.resolve(cssPath.replace('./src', './dist'));
        if (fs.existsSync(fullPath)) {
          const cssContent = fs.readFileSync(fullPath, 'utf8');
          console.log(`Injecting CSS from ${cssPath} into ${distComponentFile}`);
          return cssContent; // Replace @import with actual CSS content
        } else {
          console.warn(`CSS file not found: ${cssPath}`);
          return ''; // Remove @import if file not found
        }
      })}</style>`;
    });

    // Write the modified component to the `dist/components` folder
    fs.writeFileSync(distComponentFile, componentCode, 'utf8');
  });
}

injectCSS();
