const fs = require('fs');
const path = require('path');

// Define source and destination paths
const darkLogoPath = path.join(__dirname, 'bootsplash_logo.png');
const lightLogoPath = path.join(__dirname, 'bootsplash_logo_light.png');
const nativeAssetsDir = path.join(__dirname, '../native/assets');

// Copy the logos to the native assets directory
async function main() {
  try {
    console.log('Copying logos to native assets directory...');
    
    // Verify logos exist
    if (!fs.existsSync(darkLogoPath)) {
      throw new Error(`Dark logo not found at: ${darkLogoPath}`);
    }
    
    if (!fs.existsSync(lightLogoPath)) {
      throw new Error(`Light logo not found at: ${lightLogoPath}`);
    }
    
    // Create native assets directory if it doesn't exist
    if (!fs.existsSync(nativeAssetsDir)) {
      fs.mkdirSync(nativeAssetsDir, { recursive: true });
    }
    
    // Copy logos to native assets directory
    const darkLogoDestPath = path.join(nativeAssetsDir, 'bootsplash_logo_dark.png');
    const lightLogoDestPath = path.join(nativeAssetsDir, 'bootsplash_logo_light.png');
    
    fs.copyFileSync(darkLogoPath, darkLogoDestPath);
    fs.copyFileSync(lightLogoPath, lightLogoDestPath);
    
    console.log(`Copied dark logo to: ${darkLogoDestPath}`);
    console.log(`Copied light logo to: ${lightLogoDestPath}`);
    console.log('Logos copied successfully!');
    
  } catch (error) {
    console.error('Error copying logos:', error);
    process.exit(1);
  }
}

main(); 