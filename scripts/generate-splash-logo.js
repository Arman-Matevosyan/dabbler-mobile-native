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

// Use existing logo files instead of generating them
async function main() {
  try {
    console.log('Generating splash screen with existing logos...');
    
    // Paths to the existing logo files
    const darkLogoPath = path.join(__dirname, 'bootsplash_logo.png');
    const lightLogoPath = path.join(__dirname, 'bootsplash_logo_light.png');
    
    // Verify logos exist
    if (!fs.existsSync(darkLogoPath)) {
      throw new Error(`Dark logo not found at: ${darkLogoPath}`);
    }
    
    if (!fs.existsSync(lightLogoPath)) {
      throw new Error(`Light logo not found at: ${lightLogoPath}`);
    }
    
    console.log(`Using dark logo from: ${darkLogoPath}`);
    console.log(`Using light logo from: ${lightLogoPath}`);
    
    // Generate with light theme (default)
    const command = `npx react-native-bootsplash generate ${lightLogoPath} --background=${colors.light.background} --logo-width=100`;
    console.log(`Running command: ${command}`);
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('Splash screen assets created successfully!');
    console.log('Note: Dark mode is configured via Android/iOS theme files');
    
  } catch (error) {
    console.error('Error generating splash screen assets:', error);
    process.exit(1);
  }
}

main(); 