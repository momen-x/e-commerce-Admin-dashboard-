"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IDialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function DialogModel({
  title,
  description,
  isOpen,
  onClose,
  children,
}: IDialogProps) {
  const onChange = (isOben: boolean) => {
    if (!isOben) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description} </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">{children}</div>
        </div>
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
