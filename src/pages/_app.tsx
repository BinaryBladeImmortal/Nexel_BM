import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Component {...pageProps} />
        <Toaster position="top-center" richColors />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
