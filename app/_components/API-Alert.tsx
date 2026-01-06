"use client";
import {  Copy, Server } from "lucide-react";
import { APIAlertProps } from "../interface/interface";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const APIAlert = ({
  description,
  title,
  variant = "public",
}: APIAlertProps) => {
  return (
    <div>
      <Alert variant={"default"}>
        <Server />
        <AlertTitle className="flex items-center gap-x-2">
          {title}

          <Badge className={`${variant==='admin'?'bg-red-600 text-white':''}`}>{variant} </Badge>
        </AlertTitle>
        <AlertDescription>
          <code className="font-mono font-sm font-semibold flex w-full items-center justify-around">{description}

          <Button size={'icon'} variant={"outline"}color="black"  onClick={() => {
            navigator.clipboard.writeText(description);
            toast.success("API route copied to the clicpbord");
          }}>

          <Copy color="black"/>
          </Button>
          </code>

        </AlertDescription>
      </Alert>
    </div>
  );
};

export default APIAlert;
