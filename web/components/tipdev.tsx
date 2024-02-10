import { useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppModal, ellipsify } from './ui/ui-layout';
import { useTransferSol } from './account/account-data-access';


const DevSolanaAddress = '4qHirpRyftPeQZBRGcwkfDLJRxfaYHKb2gfkiB654qGe';

const TipDevButton = () => {
    const wallet = useWallet();
    const address = wallet.publicKey ? new PublicKey(wallet.publicKey) : null;

    if (!address || !wallet.sendTransaction) {
        return <div></div>;
    }
    const [showSendModal, setShowSendModal] = useState(false);

    return (
        <>
            {wallet && (
                <div>
                    <ModalTipDev
                        address={address}
                        show={showSendModal}
                        hide={() => setShowSendModal(false)}
                    />
                    <button
                        disabled={!wallet.publicKey}
                        className="btn btn-xs lg:btn-md btn-outline"
                        onClick={() => setShowSendModal(true)}
                    >
                        Tip Dev
                    </button>
                </div>
            )}
        </>
    );
};


function ModalTipDev({
    hide,
    show,
    address,
}: {
    hide: () => void;
    show: boolean;
    address: PublicKey;
}) {
    const wallet = useWallet();
    const mutation = useTransferSol({ address });
    const [amount, setAmount] = useState('0.01');

    if (!address || !wallet.sendTransaction) {
        return <div>Wallet not connected</div>;
    }

    return (
        <AppModal
            hide={hide}
            show={show}
            title="Tip Dev"
            submitDisabled={!amount || mutation.isPending}
            submitLabel="Send Tip"
            submit={() => {
                mutation
                    .mutateAsync({
                        destination: new PublicKey(DevSolanaAddress),
                        amount: parseFloat(amount),
                    })
                    .then(() => hide());
            }}
        >
            <p> Sending to: <strong><a href="https://solscan.io/account/4qHirpRyftPeQZBRGcwkfDLJRxfaYHKb2gfkiB654qGe" target="_blank" rel="noopener noreferrer">MoDevz.sol</a></strong> </p>

            <input
                disabled={mutation.isPending}
                type="number"
                step="any"
                min="0.01"
                placeholder="Amount"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
        </AppModal>
    );
}

export default TipDevButton;
