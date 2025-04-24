const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define source and destination paths
const darkLogoPath = path.join(__dirname, 'bootsplash_logo.png');
const lightLogoPath = path.join(__dirname, 'bootsplash_logo_light.png');
const androidDrawableDir = path.join(__dirname, '../android/app/src/main/res/drawable');
const androidDrawableNightDir = path.join(__dirname, '../android/app/src/main/res/drawable-night');

// Copy the logos to the drawable directory
async function main() {
  try {
    console.log('Copying logos to Android resources...');
    
    // Verify logos exist
    if (!fs.existsSync(darkLogoPath)) {
      throw new Error(`Dark logo not found at: ${darkLogoPath}`);
    }
    
    if (!fs.existsSync(lightLogoPath)) {
      throw new Error(`Light logo not found at: ${lightLogoPath}`);
    }
    
    // Create drawable directories if they don't exist
    if (!fs.existsSync(androidDrawableDir)) {
      fs.mkdirSync(androidDrawableDir, { recursive: true });
    }
    
    if (!fs.existsSync(androidDrawableNightDir)) {
      fs.mkdirSync(androidDrawableNightDir, { recursive: true });
    }
    
    // Copy logos to drawable directory with appropriate names
    const darkLogoDestPath = path.join(androidDrawableDir, 'bootsplash_logo_dark.png');
    const lightLogoDestPath = path.join(androidDrawableDir, 'bootsplash_logo_light.png');
    
    fs.copyFileSync(darkLogoPath, darkLogoDestPath);
    fs.copyFileSync(lightLogoPath, lightLogoDestPath);
    
    console.log(`Copied dark logo to: ${darkLogoDestPath}`);
    console.log(`Copied light logo to: ${lightLogoDestPath}`);
    console.log('Splash screen logos copied successfully!');
    
  } catch (error) {
    console.error('Error copying logos:', error);
    process.exit(1);
  }
}

main(); 