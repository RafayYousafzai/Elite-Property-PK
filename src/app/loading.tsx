"use client";

import { Spinner } from "@heroui/react";
import React from "react";

export default function loading() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Spinner color="primary" />
    </div>
  );
}
