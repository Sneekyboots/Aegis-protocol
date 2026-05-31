import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

const suiNetwork = process.env.REACT_APP_SUI_NETWORK || 'testnet';
const rpcUrl = process.env.REACT_APP_SUI_ENDPOINT || 'https://fullnode.testnet.sui.io:443';

export function SuiProviders({ children }) {
  return (
    <SuiClientProvider networks={{ [suiNetwork]: { url: rpcUrl } }} defaultNetwork={suiNetwork}>
      <WalletProvider autoConnect>
        {children}
      </WalletProvider>
    </SuiClientProvider>
  );
}
