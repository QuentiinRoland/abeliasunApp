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
      image: "./assets/abeliasunSplash.png",
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
    extra: {
      eas: {
        projectId: "67b32402-2efc-40f4-b0d7-739644ca11ea",
      },
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
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
