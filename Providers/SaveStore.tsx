"use client";
import { IStore } from "../app/interface/interface";

const SaveStore = ({ store }: { store: IStore }) => {
  if (store) {
    localStorage.setItem("store", JSON.stringify(store));
  } else {
    console.log("No store found to save");
  }
  return null;
};

export default SaveStore;
