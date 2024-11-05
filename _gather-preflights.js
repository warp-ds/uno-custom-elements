import fs from 'fs';
import path from 'path';

// Paths
const componentsDir = './src/components';
let preflightCSS = '';

// Function to gather preflight styles from all component files
async function gatherPreflights() {
  console.log("Starting to gather preflight styles...");

  // Get all subdirectories in componentsDir
  const componentFolders = fs.readdirSync(componentsDir).filter((folder) => {
    const fullPath = path.join(componentsDir, folder);
    const isDirectory = fs.statSync(fullPath).isDirectory();
    console.log(`Found folder: ${folder} - Directory: ${isDirectory}`);
    return isDirectory;
  });

  for (const folder of componentFolders) {
    const componentFile = path.join(componentsDir, folder, `${folder}.js`);
    console.log(`Processing component file: ${componentFile}`);

    if (fs.existsSync(componentFile)) {
      try {
        const { preflightStyles } = await import(`./${componentFile}`);
        if (preflightStyles) {
          console.log(`Adding preflight styles for component: ${folder}`);
          preflightCSS += preflightStyles + '\n'; // Append each component's preflight styles
        }
      } catch (error) {
        console.error(`Error loading preflight styles from ${componentFile}:`, error);
      }
    } else {
      console.warn(`Component file not found: ${componentFile}`);
    }
  }

  console.log("Final preflight CSS:\n", preflightCSS);
  return preflightCSS;
}

// Gather preflight CSS and export it for UnoCSS
export default await gatherPreflights();
