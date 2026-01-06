"use client";

import React, { useEffect, useState } from "react";
import StoreModel from "@/components/Models/store-model";

const ModelProvider = () => {
  const [isMounted, setIsMunted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMunted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <StoreModel />
    </div>
  );
};

export default ModelProvider;
