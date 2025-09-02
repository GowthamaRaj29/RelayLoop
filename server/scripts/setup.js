#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Setting up RelayLoop Backend...\n');

// Step 1: Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env file from template...');
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please update the .env file with your Supabase credentials before starting the server.\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Step 2: Install dependencies
console.log('📦 Installing dependencies...');
exec('npm install', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
  
  console.log('✅ Dependencies installed successfully!\n');
  
  // Step 3: Show next steps
  console.log('🎉 Setup completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Update your .env file with your Supabase credentials');
  console.log('2. Set up your Supabase database tables (see README.md)');
  console.log('3. Run the server with: npm run start:dev');
  console.log('4. Visit http://localhost:3001/api/docs for API documentation\n');
  
  console.log('🔗 Useful commands:');
  console.log('  npm run start:dev    - Start development server');
  console.log('  npm run build        - Build for production');
  console.log('  npm run start:prod   - Start production server');
  console.log('  npm test             - Run tests');
});
