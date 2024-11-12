import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.ng.sqlite.typeorm',
  appName: 'ionic-ng-sqlite-typeorm',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'ionic-sqlite-typeorm-app',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle : "Biometric login for capacitor sqlite"
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth : false,
        biometricTitle : "Biometric login for capacitor sqlite",
        biometricSubTitle : "Log in using your biometric"
      },
      electronWindowsLocation: "C:\\ProgramData\\CapacitorDatabases",
      electronMacLocation: "/Volumes/Development_Lacie/Development/CapacitorDatabases",
      electronLinuxLocation: "Databases"
    }
  }
};

export default config;
