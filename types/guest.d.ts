import React from "react";
import { StaticImageData } from "next/image";

export type MaxWrapperTypes = {
  children: React.ReactNode;
  className?: string;
};

export type LogoTypes = {
  className: string;
  image: StaticImageData;
  href: string;
};

export type NavLinkTypes = {
  name: string;
  to: string;
};

export type FaqsTypes = {
  question: string;
  answer: string;
};

export type footerLinksTypes = {
  name: string;
  link: string;
};