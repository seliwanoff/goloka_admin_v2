import React, { useEffect } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useInvoiceOverlay } from "@/stores/overlay";
import { X } from "lucide-react";
import DownloadInvoice from "../widgets/download_invoice";
import { getTrxId } from "@/services/transactions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const InvoiceModal = () => {
  const { open, setOpen, id } = useInvoiceOverlay();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    data: getResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getResponse", id],
    queryFn: async () => {
      if (!id) return null;
      return await getTrxId(id);
    },
    enabled: open && !!id,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && id) {
      //@ts-ignore
      queryClient.invalidateQueries(["getResponse", id]);
    }
  }, [open, id]);

  const getResponseData = getResponse?.data || null;

  if (!open) return null;

  return (
    <>
      {isDesktop ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
            <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
              <SheetTitle className="font-normal text-white">
                {/** @ts-ignore */}
                Invoice {getResponseData?.reference}
              </SheetTitle>
              <SheetDescription className="text-white">
                Transaction ID
              </SheetDescription>
              <span
                onClick={() => setOpen(false)}
                className="absolute right-4 mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
              >
                <X size={20} />
              </span>
            </SheetHeader>
            <div className="mt-24">
              <DownloadInvoice
                //@ts-ignore
                getResponseData={getResponseData}
                isError={isError}
                isLoading={isLoading}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
            <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
              <DrawerTitle className="font-normal text-white">
                {/** @ts-ignore */}
                Invoice {getResponseData?.reference}
              </DrawerTitle>
              <DrawerDescription className="text-white">
                Transaction ID
              </DrawerDescription>
              <span
                onClick={() => setOpen(false)}
                className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
              >
                <X size={20} />
              </span>
            </DrawerHeader>
            <div className="mt-24" />
            <DownloadInvoice
              //@ts-ignore
              getResponseData={getResponseData}
              isError={isError}
              isLoading={isLoading}
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default InvoiceModal;
