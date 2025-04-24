const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use the hardcoded colors instead of importing them
const colors = {
  light: {
    background: '#FFFFFF',
    accent: '#337BE2',
  },
  dark: {
    background: '#121212',
    accent: '#337BE2',
  }
};

// Define source and destination paths
const darkLogoPath = path.join(__dirname, 'bootsplash_logo.png');
const lightLogoPath = path.join(__dirname, 'bootsplash_logo_light.png');
const androidDrawableDir = path.join(__dirname, '../android/app/src/main/res/drawable');
const androidDrawableNightDir = path.join(__dirname, '../android/app/src/main/res/drawable-night');

// Setup splashscreen
async function main() {
  try {
    console.log('Setting up splashscreen with custom logos...');
    
    // Verify logos exist
    if (!fs.existsSync(darkLogoPath)) {
      throw new Error(`Dark logo not found at: ${darkLogoPath}`);
    }
    
    if (!fs.existsSync(lightLogoPath)) {
      throw new Error(`Light logo not found at: ${lightLogoPath}`);
    }
    
    console.log('Step 1: Generating basic splash assets...');
    // Generate with light theme (default)
    const generateCommand = `npx react-native-bootsplash generate ${lightLogoPath} --background=${colors.light.background} --logo-width=100`;
    console.log(`Running command: ${generateCommand}`);
    execSync(generateCommand, { stdio: 'inherit' });
    
    console.log('\nStep 2: Setting up dark mode support...');
    
    // Create drawable directories if they don't exist
    if (!fs.existsSync(androidDrawableDir)) {
      fs.mkdirSync(androidDrawableDir, { recursive: true });
    }
    
    if (!fs.existsSync(androidDrawableNightDir)) {
      fs.mkdirSync(androidDrawableNightDir, { recursive: true });
    }
    
    // Remove any existing bootsplash_logo.png from drawable-night to avoid conflicts
    const nightPngPath = path.join(androidDrawableNightDir, 'bootsplash_logo.png');
    if (fs.existsSync(nightPngPath)) {
      console.log(`Removing conflicting file: ${nightPngPath}`);
      fs.unlinkSync(nightPngPath);
    }
    
    // Copy logos to drawable directory with appropriate names
    const darkLogoDestPath = path.join(androidDrawableDir, 'bootsplash_logo_dark.png');
    const lightLogoDestPath = path.join(androidDrawableDir, 'bootsplash_logo_light.png');
    
    fs.copyFileSync(darkLogoPath, darkLogoDestPath);
    fs.copyFileSync(lightLogoPath, lightLogoDestPath);
    
    // Create drawable XMLs
    const lightDrawableXml = `<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/bootsplash_logo_light" />`;
    
    const darkDrawableXml = `<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/bootsplash_logo_dark" />`;
    
    fs.writeFileSync(path.join(androidDrawableDir, 'bootsplash_logo.xml'), lightDrawableXml);
    fs.writeFileSync(path.join(androidDrawableNightDir, 'bootsplash_logo.xml'), darkDrawableXml);
    
    console.log('Custom logos setup complete!');
    console.log(`Light logo: ${lightLogoDestPath}`);
    console.log(`Dark logo: ${darkLogoDestPath}`);
    
    console.log('\nSplash screen setup completed successfully!');
    console.log('Make sure to rebuild your app to see the changes.');
    
  } catch (error) {
    console.error('Error setting up splash screen:', error);
    process.exit(1);
  }
}

main(); 