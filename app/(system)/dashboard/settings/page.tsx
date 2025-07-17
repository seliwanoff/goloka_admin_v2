"use client";

import SettingsWeb from "@/components/settings-com/tab-comps/desktop_settings";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Clean up previous blob URL if it exists
    if (imgUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imgUrl);
    }

    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setImage(file);
  };

  // Clean up the blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imgUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [imgUrl]);
  return (
    <>
      {/* DESKTOP */}
      <SettingsWeb
        imgUrl={imgUrl}
        onImageChange={handleChange}
        images={image}
      />
      {/* MOBILE */}
      {/* <MobileSettings /> */}
    </>
  );
};

export default SettingsPage;
