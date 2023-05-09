import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/toaster";
import { SummaryInfoContextWrapper } from "@/components/context/SummaryInfoContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SummaryInfoContextWrapper>
          <Toaster />
          <Component {...pageProps} />
        </SummaryInfoContextWrapper>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
