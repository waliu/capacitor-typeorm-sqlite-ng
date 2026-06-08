import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'capacitor.typeorm.sqlite',
  appName: 'capacitor-typeorm-sqlite-ng',
  webDir: 'dist/capacitor-typeorm-sqlite-ng/browser',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'capacitor-typeorm-sqlite-ng',
      androidIsEncryption: false,
    },
  },
};

export default config;
