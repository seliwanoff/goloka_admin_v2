import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React from "react";
import { Dog } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
//import Pattern from "@/public/assets/images/campaign/deleteicon.png";

type ComponentProps = {
  title: string;
  content: string;
  open: boolean;
  buttonText?: string;
  action: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const DeleteDialog: React.FC<ComponentProps> = ({
  title,
  content,
  open,
  action,
  setOpen,
  buttonText,
}) => {
  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
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
                  <div className="mx-auto flex w-max items-center justify-center rounded-full p-2">
                    <Image src={""} alt="BgPattern" className="h-full w-full" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{content}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
                  <Button
                    type="button"
                    className="w-full max-w-[185px] rounded-full border border-[#7F55DA] bg-white font-medium text-[#7F55DA]"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="w-full max-w-[185px] rounded-full bg-[#EB5757]"
                    onClick={action}
                  >
                    {buttonText || " Delete groups"}
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

export default DeleteDialog;
