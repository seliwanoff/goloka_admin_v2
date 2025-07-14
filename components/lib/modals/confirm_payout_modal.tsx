import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Warning2 } from "iconsax-react";
import { FaSpinner } from "react-icons/fa";
import { useShowPayoutModal } from "@/stores/overlay";
import { CircleCheck } from "lucide-react";

type ComponentProps = {
  title?: string;
  content?: string;
  open?: boolean;
  action: any;
  isLoading?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
const ConfirmPayoutModal: React.FC<ComponentProps> = ({
  title,
  content,
  open,
  action,
  setOpen,
  isLoading,
}) => {
  const { setOpenFilter, openFilter } = useShowPayoutModal();
  return (
    <Transition show={openFilter}>
      <Dialog className="relative z-10" onClose={setOpenFilter}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center overflow-hidden p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex w-max items-center justify-center rounded-full bg-[#27AE60] opacity-[12%] p-2">
                    <CircleCheck
                      size={20}
                      strokeWidth={1.5}
                      className="h-6 w-6 text-[#27AE60] "
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Mark as paid
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to mark request as paid? this
                        request will be moved to paid list
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
                  <Button
                    type="button"
                    disabled={isLoading}
                    className="w-full rounded-full border border-indigo-600"
                    onClick={() => setOpenFilter(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600"
                    onClick={action}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      "Paid"
                    )}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmPayoutModal;
