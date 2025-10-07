"use client";

import { sc } from "@pkvsinha/react-app/server";

const config = {
  view: "Welcome to the world of apps",
};

export default function Home() {
  return sc(config);
}
