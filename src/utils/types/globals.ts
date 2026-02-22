import { LucideProps } from "lucide-react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ForwardRefExoticComponent, ReactElement, ReactNode, RefAttributes } from "react";

export type NextPageWithLayout<T = unknown> = NextPage<T> & {
    getLayout: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export type Routes = {
    path: string;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  }