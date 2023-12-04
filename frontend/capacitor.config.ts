import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sparkingapp.app',
  appName: 'Sparking',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
