/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import DesktopSupport from "@/components/support_comps/MobileSupport";
import React from "react";

type PageProps = {};

const SupportPage: React.FC<PageProps> = ({}) => {
  return (
    <>
      {/* DESKTOP */}
      {<DesktopSupport />}
      {/*** 
    <MobileSupport /> 

    */}
    </>
  );
};

export default SupportPage;
