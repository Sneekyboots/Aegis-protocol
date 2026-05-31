import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

export function WalletButton() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  if (!account) {
    return <ConnectButton />;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:block text-xs font-mono text-cyan-300">
        {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all"
      >
        Disconnect
      </button>
    </div>
  );
}
