import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  //   DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface RejectCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

const rejectionReasons = [
  "Incomplete Information",
  "Invalid Data",
  "Poor Quality Content",
  "Inappropriate Content",
  "Duplicate Campaign",
  "Technical Issues",
  "Policy Violation",
  "Other",
];

export default function RejectCampaignDialog({
  open,
  onOpenChange,
  onSubmit,
}: RejectCampaignDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit({ title, description });
    onOpenChange(false);
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Reject Campaign
            </DialogTitle>
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Let the organization know the reason you want to reject this
              campaign
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Select onValueChange={setTitle} value={title}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="explain the reason here"
                className="min-h-[120px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full"
          onClick={handleSubmit}
        >
          Reject campaign
        </Button>
      </DialogContent>
    </Dialog>
  );
}
