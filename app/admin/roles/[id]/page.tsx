"use client";

import { useEffect, useState, use } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GhostButton, PrimaryButton } from "@/components/ui/Buttons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconBolt } from "@/components/icons";
import { format } from "date-fns";

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

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const roleId = resolvedParams.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    // Fetch Role Data
    useEffect(() => {
        const fetchRole = async () => {
            const res = await fetch(`/api/admin/roles/${roleId}`);
            if (res.ok) {
                const data = await res.json();
                // Populate form
                // Note: data.userId is a populated object, but select needs ID.
                // Wait, POST saves 'userId' as the raw ID.
                // But in GET /api/admin/roles/[id], I populated it.
                // So data.userId._id is the User ID.
                // But wait, my Users list returns Profile objects where .userId is the User object.
                // This is confusing. 
                // Role.userId ref is "User". So data.userId is the User object.
                // Users endpoint returns Profiles. Profile.userId is the User object.
                // So I need to match data.userId._id with Profile.userId._id.

                setSelectedUser(data.userId._id);
                setSelectedIdentity(data.identityId._id);
                setTitle(data.title);
                setOrganization(data.organization);
                setStartDate(data.startDate ? format(new Date(data.startDate), "yyyy-MM-dd") : "");
                setEndDate(data.endDate ? format(new Date(data.endDate), "yyyy-MM-dd") : "");
                setDescription(data.description);
                setWorkMode(data.workMode);

                // Also ensure we fetch identities for this user immediately
                fetchIdentities(data.userId._id);
            } else {
                toast.error("Failed to fetch role");
                router.push("/admin/roles");
            }
            setLoading(false);
        };

        const fetchUsers = async () => {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        };

        fetchUsers();
        if (roleId) fetchRole();
    }, [roleId]);

    const fetchIdentities = async (userId: string) => {
        const res = await fetch(`/api/admin/identities?userId=${userId}`);
        if (res.ok) {
            const data = await res.json();
            setMatchingIdentities(data);
        }
    };

    // Prepare identities when user changes manually
    useEffect(() => {
        if (selectedUser && !loading) {
            fetchIdentities(selectedUser);
        }
    }, [selectedUser]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            userId: selectedUser,
            identityId: selectedIdentity,
            title,
            organization,
            startDate,
            endDate: endDate || null,
            description,
            workMode,
        };

        try {
            const res = await fetch(`/api/admin/roles/${roleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Role updated successfully");
                router.push("/admin/roles");
            } else {
                toast.error("Failed to update role");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#fef7f5] dark:bg-[#1f1e2a]">
                <IconBolt className="h-8 w-8 text-[#ff4c2b] animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fef7f5] dark:bg-[#1f1e2a] text-[#1f1e2a] dark:text-white flex transition-colors duration-500">
            <AdminSidebar activeTab="roles" />

            <div className="flex-1 md:ml-72 transition-all duration-500">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1f1e2a]/5 dark:border-white/5 bg-white/80 dark:bg-[#121212]/80 px-6 py-5 backdrop-blur-xl md:px-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">Edit Role</h1>
                        <p className="text-sm font-medium text-[#5d5b66] dark:text-gray-400 mt-1">Modify existing role details.</p>
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
                            <PrimaryButton label={saving ? "Saving..." : "Save Changes"} onClick={() => { }} disabled={saving} />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
