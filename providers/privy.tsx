'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export default function CPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmb7abpja000zl50mkyvb9x8c"
      clientId="client-WY6LzfH3qSqHdK7UP9xaU8Uj8DPXvhSKCFvuMEHLTaeco"
      config={{
        appearance: {
          logo: 'https://paperhead.io/logo100x100.png',
          walletChainType: 'solana-only' as const,
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets', // Or 'users-without-wallets'
          }
        },
        solanaClusters: [{name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com'}]
      }}
    >
      {children}
    </PrivyProvider>
  );
}