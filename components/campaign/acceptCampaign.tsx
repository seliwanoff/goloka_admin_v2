import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";
import { FaSpinner } from "react-icons/fa";

interface AcceptCampaignDialogProps {
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export default function AcceptCampaignDialog({
  loading,
  open,
  onOpenChange,
  onAccept,
}: AcceptCampaignDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="p-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6 text-orange-500" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <DialogTitle className="text-lg font-normal ">
              Accept campaign
            </DialogTitle>
            <p className="text-gray-600 text-base ">
              Are you sure you want to accept <br />
              this campaign?
            </p>
          </div>
        </DialogHeader>

        <div className="flex p-4 gap-3">
          <Button
            variant="outline"
            className="flex-1 text-base py-3 rounded-full border border-[#3365E3]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 text-base py-3 font-normal rounded-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onAccept();
              onOpenChange(false);
            }}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Accept campaign"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
