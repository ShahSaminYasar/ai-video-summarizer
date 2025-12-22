"use client";
import { MainContext } from "@/providers/MainProvider";
import { useContext } from "react";

export const useMainContext = () => {
  return useContext(MainContext);
};
