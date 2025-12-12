import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Identity, Role, Milestone } from "@/lib/types";
import { IconSpark } from "@/components/icons";

interface MintIdentityButtonProps {
    identity: Identity;
    roles: Role[];
    milestones: Milestone[];
}

export function MintIdentityButton({ identity, roles, milestones }: MintIdentityButtonProps) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { setVisible } = useWalletModal();
    const { reloadDashboardData, profile } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const relevantRoles = roles.filter(r => r.identityId === identity.id);
    const relevantMilestones = milestones.filter(m => relevantRoles.some(r => r.id === m.roleId));

    const handleClick = () => {
        if (!wallet.connected) {
            setVisible(true);
            return;
        }
        handleMint();
    };

    const handleMint = async () => {
        if (!wallet.publicKey) return;
        setLoading(true);
        setStatus("Initializing...");

        try {
            // 1. Setup Umi
            const umi = createUmi(connection.rpcEndpoint)
                .use(walletAdapterIdentity(wallet))
                .use(mplTokenMetadata())
                .use(irysUploader({ address: 'https://devnet.irys.xyz' }));

            setStatus("Uploading Metadata...");

            // 2. Prepare Metadata
            const metadata = {
                name: identity.name, // e.g. "Full Stack Developer"
                description: `${identity.description || `Professional Identity for ${profile?.fullName}`}\n\nView Full Portfolio: https://myreliq.com/portfolio/${profile?.shareSlug}/${identity.slug}`,
                image: profile?.profileImage || "https://myreliq.com/placeholder-nft.png",
                attributes: [
                    { trait_type: "Roles", value: relevantRoles.length.toString() },
                    { trait_type: "Milestones", value: relevantMilestones.length.toString() },
                    { trait_type: "User", value: profile?.fullName || "Anonymous" }
                ],
                properties: {
                    files: [
                        {
                            uri: profile?.profileImage || "https://myreliq.com/placeholder-nft.png",
                            type: "image/png",
                        },
                    ],
                },
            };

            const uri = await umi.uploader.uploadJson(metadata);
            console.log("Metadata uploaded:", uri);

            setStatus("Minting NFT...");

            // 3. Mint NFT
            const mint = generateSigner(umi);
            const { signature } = await createNft(umi, {
                mint,
                name: identity.name,
                uri,
                sellerFeeBasisPoints: percentAmount(0),
                isCollection: false,
            }).sendAndConfirm(umi);

            console.log("Minted:", mint.publicKey);
            setStatus("Saving...");

            // 4. Save to DB
            await fetch("/api/identities", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: identity.id,
                    mintAddress: mint.publicKey,
                    metadataUri: uri
                }),
            });

            await reloadDashboardData();
            setStatus("Minted!");
            setTimeout(() => setStatus(null), 3000);

        } catch (error) {
            console.error("Minting failed", error);
            setStatus("Failed");
        } finally {
            setLoading(false);
        }
    };

    if (identity.mintAddress) {
        return (
            <a
                href={`https://explorer.solana.com/address/${identity.mintAddress}?cluster=devnet`}
                target="_blank"
                className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition flex items-center gap-1 border border-green-200"
                title="View on Solana Explorer"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                On-Chain
            </a>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {status && <span className="text-xs text-[#ff4c2b] animate-pulse font-mono">{status}</span>}
            <button
                onClick={handleClick}
                disabled={loading}
                className="text-xs font-bold text-white bg-[#1f1e2a] px-3 py-1.5 rounded-lg hover:bg-black transition disabled:opacity-50 flex items-center gap-1 shadow-md shadow-black/10"
            >
                <IconSpark className="w-3 h-3 text-[#ff4c2b]" />
                {loading ? "Minting..." : (wallet.connected ? "Mint Identity" : "Connect & Mint")}
            </button>
        </div>
    );
}
