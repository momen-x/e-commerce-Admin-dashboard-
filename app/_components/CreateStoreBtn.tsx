"use client";

import { Button } from "@/components/ui/button";
import { useStoreModel } from "@/Hooks/Use_store_model";

const CreateStoreBtn = () => {
      const { onOpen } = useStoreModel();

  return <div><Button variant={'secondary'} onClick={onOpen}> Create Store </Button></div>;
};

export default CreateStoreBtn;
