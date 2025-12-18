"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { IconBolt } from "@/components/icons";

interface User {
    _id: string; // Profile ID
    fullName: string;
    userId: {
        _id: string;
        email: string;
        role: string;
        isSuspended: boolean;
        createdAt: string;
    };
    shareSlug: string;
    createdAt: string;
}

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleSuspension = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? "unsuspend" : "suspend"} this user?`)) return;

        setActionLoading(userId);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, isSuspended: !currentStatus, action: "toggle_suspension" }),
            });

            if (res.ok) {
                toast.success(`User ${currentStatus ? "unsuspended" : "suspended"} successfully`);
                fetchUsers();
            } else {
                toast.error("Failed to update user status");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <IconBolt className="h-8 w-8 text-[#ff4c2b] animate-spin" />
            </div>
        );
    }

    return (
        <div className="rounded-[2.5rem] bg-white dark:bg-[#2a2935] p-8 shadow-sm border border-[#1f1e2a]/5 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1f1e2a] dark:text-white">User Management</h2>
                <p className="text-sm text-[#5d5b66] dark:text-gray-400 mt-1">View and manage all registered users.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#1f1e2a]/5 dark:border-white/5">
                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">User</th>
                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Role</th>
                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Joined</th>
                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Status</th>
                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f1e2a]/5 dark:divide-white/5">
                        {users.map((user) => (
                            <tr key={user.userId?._id || user._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-[#fef7f5] dark:bg-white/10 flex items-center justify-center font-bold text-[#ff4c2b]">
                                            {(user.fullName || "?").charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1f1e2a] dark:text-white">{user.fullName}</p>
                                            <p className="text-xs text-[#5d5b66] dark:text-gray-400">{user.userId?.email || "No Email"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-white/10 px-2 py-1 text-xs font-bold text-[#5d5b66] dark:text-gray-300">
                                        {user.userId?.role || "USER"}
                                    </span>
                                </td>
                                <td className="py-4 text-sm font-medium text-[#5d5b66] dark:text-gray-400">
                                    {user.userId?.createdAt ? format(new Date(user.userId.createdAt), "MMM d, yyyy") : "-"}
                                </td>
                                <td className="py-4">
                                    {user.userId?.isSuspended ? (
                                        <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                                            Suspended
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                                            Active
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 text-right">
                                    <button
                                        onClick={() => toggleSuspension(user.userId._id, user.userId.isSuspended)}
                                        disabled={actionLoading === user.userId._id}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.userId?.isSuspended
                                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400"
                                                : "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                                            }`}
                                    >
                                        {actionLoading === user.userId._id ? "..." : user.userId?.isSuspended ? "Unsuspend" : "Suspend"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="text-center py-12 text-[#5d5b66] dark:text-gray-400">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
