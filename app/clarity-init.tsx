"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

export default function ClarityInit() {
  useEffect(() => {
    Clarity.init("wslz4bfzte");
  }, []);
  return null;
}
