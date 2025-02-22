import "dotenv/config";

export default {
  expo: {
    name: "abeliasunApp",
    slug: "abeliasunApp",
    version: "1.0.0",
    entryPoint: "App.js",
    orientation: "portrait",
    icon: "./assets/iconAppAbeliasun.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/abeliasunWallpaperSplash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.abeliasun.abeliasunApp",
      buildNumber: "1",
      infoPlist: {
        LSApplicationQueriesSchemes: ["itms-apps"],
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.abeliasun.abeliasunApp",
      versionCode: 1,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    scheme: "abeliasunapp",
    developmentClient: false,
    packagerOpts: {
      dev: false,
    },
    extra: {
      eas: {
        projectId: "67b32402-2efc-40f4-b0d7-739644ca11ea",
      },
      FIREBASE_API_KEY: "PLACEHOLDER",
      FIREBASE_AUTH_DOMAIN: "PLACEHOLDER",
      FIREBASE_PROJECT_ID: "PLACEHOLDER",
      FIREBASE_STORAGE_BUCKET: "PLACEHOLDER",
      FIREBASE_MESSAGING_SENDER_ID: "PLACEHOLDER",
      FIREBASE_APP_ID: "PLACEHOLDER",
      FIREBASE_MEASUREMENT_ID: "PLACEHOLDER",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/67b32402-2efc-40f4-b0d7-739644ca11ea",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
    assetBundlePatterns: ["**/*"],
  },
};
