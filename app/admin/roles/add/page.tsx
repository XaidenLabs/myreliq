"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GhostButton, PrimaryButton } from "@/components/ui/Buttons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconBolt } from "@/components/icons";

interface User {
    _id: string; // Profile ID
    fullName: string;
    userId: {
        _id: string;
        email: string;
    }
}

interface Identity {
    _id: string;
    name: string;
    slug: string;
}

export default function AddRolePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [matchingIdentities, setMatchingIdentities] = useState<Identity[]>([]);

    // Form State
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedIdentity, setSelectedIdentity] = useState("");
    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [workMode, setWorkMode] = useState("remote");

    // Fetch users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        };
        fetchUsers();
    }, []);

    // When user selected, fetch their identities (mocked for now as we don't have dedicated endpoint yet, or we assume primary?)
    // Actually, Role requires IdentityId. If I select a user, I need their Identity ID.
    // Since I don't have an endpoint to fetch identities by user ID easily without creating one, 
    // maybe I should fetch roles or some other way.
    // OR create a quick endpoint for identities.
    // For now, I'll just assume I can't easily fetch them without an endpoint.
    // Let's create `api/admin/identities` quickly? Or just `api/identities`?
    // Let's create `api/admin/identities?userId=...` in `api/admin/identities/route.ts`?
    // Wait, the plan didn't strictly say `api/admin/identities`.
    // I will try to implement a workaround: Fetch all identities? No too many.
    // I will IMPLEMENT `app/api/admin/identities/route.ts` to support this page. It wasn't in the plan but it's NECESSARY.

    // Changing approach: User selects user. Then we fetch identities for that user.
    useEffect(() => {
        if (!selectedUser) {
            setMatchingIdentities([]);
            return;
        }

        const fetchIdentities = async () => {
            // For now, assuming we don't have the endpoint yet, I will create it.
            // But for this initial write, I'll comment out the fetch and maybe show a warning or hardcode one if I can.
            // Actually, I'll write the fetch code assuming the endpoint exists, and then I'll create the endpoint in the next step.
            const res = await fetch(`/api/admin/identities?userId=${selectedUser}`);
            if (res.ok) {
                const data = await res.json();
                setMatchingIdentities(data);
                if (data.length > 0) setSelectedIdentity(data[0]._id);
            }
        };
        fetchIdentities();
    }, [selectedUser]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Find the actual User ID from the Profile ID (selectedUser is Profile ID from Users endpoint, wait users endpoint returns Profiles with populated userId)
        // Check UsersTable.tsx: user._id is Profile ID. user.userId._id is User ID.
        // My Role model needs User ID (ref User).
        // My users state has `_id` (Profile) and `userId` (User object).
        const userProfile = users.find(u => u.userId._id === selectedUser);
        // Wait, the select value should probably be the User ID.

        const payload = {
            userId: selectedUser, // Assuming I bind User ID to the select value
            identityId: selectedIdentity,
            title,
            organization,
            startDate,
            endDate: endDate || null,
            description,
            workMode,
        };

        try {
            const res = await fetch("/api/admin/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Role created successfully");
                router.push("/admin/roles");
            } else {
                toast.error("Failed to create role");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fef7f5] dark:bg-[#1f1e2a] text-[#1f1e2a] dark:text-white flex transition-colors duration-500">
            <AdminSidebar activeTab="roles" />

            <div className="flex-1 md:ml-72 transition-all duration-500">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1f1e2a]/5 dark:border-white/5 bg-white/80 dark:bg-[#121212]/80 px-6 py-5 backdrop-blur-xl md:px-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">Add New Role</h1>
                        <p className="text-sm font-medium text-[#5d5b66] dark:text-gray-400 mt-1">Manually add a work experience for a user.</p>
                    </div>
                    <ThemeToggle />
                </header>

                <main className="px-6 py-8 md:px-10 max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#2a2935] p-8 rounded-[2.5rem] shadow-sm border border-[#1f1e2a]/5 dark:border-white/5">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">User</label>
                                <select
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map((u) => (
                                        <option key={u.userId._id} value={u.userId._id}>
                                            {u.fullName} ({u.userId.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">Identity</label>
                                <select
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    value={selectedIdentity}
                                    onChange={(e) => setSelectedIdentity(e.target.value)}
                                    required
                                    disabled={!selectedUser || matchingIdentities.length === 0}
                                >
                                    <option value="">{matchingIdentities.length === 0 ? "Select User First" : "Select Identity"}</option>
                                    {matchingIdentities.map((i) => (
                                        <option key={i._id} value={i._id}>
                                            {i.name} (/{i.slug})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">Title</label>
                                <input
                                    type="text"
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    placeholder="e.g. Senior Product Designer"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">Organization</label>
                                <input
                                    type="text"
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    placeholder="e.g. Google"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">End Date</label>
                                <input
                                    type="date"
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <p className="text-xs text-[#5d5b66] dark:text-gray-400">Leave empty for &quot;Present&quot;</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">Work Mode</label>
                                <select
                                    className="w-full h-12 rounded-xl border border-[#1f1e2a]/10 bg-transparent px-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10"
                                    value={workMode}
                                    onChange={(e) => setWorkMode(e.target.value)}
                                    required
                                >
                                    <option value="remote">Remote</option>
                                    <option value="on-site">On-site</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1f1e2a] dark:text-white">Description</label>
                            <textarea
                                className="w-full h-32 rounded-xl border border-[#1f1e2a]/10 bg-transparent p-4 font-medium focus:border-[#ff4c2b] focus:outline-none dark:border-white/10 resize-none"
                                placeholder="Describe the role and achievements..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <GhostButton label="Cancel" href="/admin/roles" />
                            <PrimaryButton label={loading ? "Creating..." : "Create Role"} onClick={() => { }} disabled={loading} />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
