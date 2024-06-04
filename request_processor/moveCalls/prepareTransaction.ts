import { PACKAGE_ADDRESS, ADMIN_CAP } from "../utils/config";

import { Transaction } from "@mysten/sui/transactions";

export async function prepareTransaction(receivers: string[]) {
    const tx = new Transaction();
    
    for (const receiver of receivers) {
        await addMoveCall(receiver, tx);
    }

    return tx;
}

const addMoveCall = async (
    receiver: string,
    tx: Transaction,
) => {

    let nft = tx.moveCall({
        target: `${PACKAGE_ADDRESS}::contract_example::mint_nft`,
        arguments: [
            tx.object(ADMIN_CAP)
        ],
    });

    tx.transferObjects([nft], tx.pure.address(receiver));

    return tx;
}
