"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function MintProfileSection() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { profile, reloadDashboardData } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleMint = async () => {
        if (!wallet.publicKey || !profile) return;
        setLoading(true);
        setStatus("Initializing Umi...");

        try {
            // 1. Setup Umi
            const umi = createUmi(connection.rpcEndpoint)
                .use(walletAdapterIdentity(wallet))
                .use(mplTokenMetadata())
                .use(mplTokenMetadata())
                .use(irysUploader({ address: 'https://devnet.irys.xyz' }));

            console.log("Umi connected to:", connection.rpcEndpoint);
            setStatus("Uploading Metadata (Ensure you have Devnet SOL)...");

            setStatus("Uploading Metadata...");

            // 2. Prepare Metadata
            const metadata = {
                name: profile.fullName,
                description: profile.headline || "MyReliq Proof-of-Work Profile",
                image: profile.profileImage || "https://myreliq.com/placeholder-nft.png", // Fallback or generate dynamic
                attributes: [
                    { trait_type: "Identities", value: "3" }, // Should be dynamic
                    { trait_type: "Roles", value: "5" },
                ],
                properties: {
                    files: [
                        {
                            uri: profile.profileImage,
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
                name: profile.fullName,
                uri,
                sellerFeeBasisPoints: percentAmount(0),
                isCollection: false,
            }).sendAndConfirm(umi);

            console.log("Minted:", mint.publicKey);
            setStatus("Saving to Profile...");

            // 4. Save to DB
            await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mintAddress: mint.publicKey }),
            });

            await reloadDashboardData();
            setStatus("Success! NFT Minted.");

        } catch (error) {
            console.error("Minting failed", error);
            setStatus("Minting failed. See console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1f1e2a] rounded-[2rem] p-8 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#ff4c2b] opacity-10 blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Mint Your On-Chain Profile</h2>
                        <p className="text-gray-400 max-w-md">Turn your proof-of-work into a verifiable NFT on Solana. Use this as your universal resume.</p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <WalletMultiButton className="!bg-[#ff4c2b] hover:!bg-[#e64426] !rounded-xl !font-bold !h-12" />

                        {wallet.connected && !profile?.mintAddress && (
                            <button
                                onClick={handleMint}
                                disabled={loading}
                                className="px-6 py-3 rounded-xl bg-white text-[#1f1e2a] font-bold hover:bg-gray-100 transition w-full md:w-auto disabled:opacity-50"
                            >
                                {loading ? "Minting..." : "Mint Profile NFT"}
                            </button>
                        )}

                        {profile?.mintAddress && (
                            <a
                                href={`https://explorer.solana.com/address/${profile.mintAddress}?cluster=devnet`}
                                target="_blank"
                                className="px-6 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/50 font-bold hover:bg-green-500/30 transition flex items-center gap-2"
                            >
                                <span>✓ Minted</span>
                                <span className="text-xs opacity-70">View on Solscan</span>
                            </a>
                        )}
                    </div>
                </div>

                {status && (
                    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-gray-300">
                        &gt; {status}
                    </div>
                )}
            </div>
        </div>
    );
}
