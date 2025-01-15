import React from "react";
import { DefaultTheme } from "@react-navigation/native";

export const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#bbb",
    background: "#fff",
  },
};
