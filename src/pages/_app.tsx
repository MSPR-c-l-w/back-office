import "@/styles/globals.css";
import type { AppPropsWithLayout } from "@/utils/types/globals";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import { EtlPipelineProvider } from "@/contexts/EtlPipelineContext";
import { BackOfficeGuard } from "@/components/auth/BackOfficeGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <AuthProvider>
      <EtlPipelineProvider>
        <BackOfficeGuard>
          <div
            className={cn(geistSans.variable, geistMono.variable, "font-sans")}
          >
            {getLayout(<Component {...pageProps} />)}
          </div>
        </BackOfficeGuard>
      </EtlPipelineProvider>
    </AuthProvider>
  );
}
