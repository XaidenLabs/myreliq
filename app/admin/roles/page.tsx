"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GhostButton, PrimaryButton } from "@/components/ui/Buttons";
import { IconBolt } from "@/components/icons";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Role {
    _id: string;
    title: string;
    organization: string;
    userId: {
        _id: string;
        email: string;
        fullName: string;
    };
    identityId: {
        _id: string;
        name: string;
        slug: string;
    };
    startDate: string;
    endDate?: string;
    workMode: string;
    createdAt: string;
}

export default function RolesManagementPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/admin/roles");
            if (res.ok) {
                const data = await res.json();
                setRoles(data);
            } else {
                toast.error("Failed to fetch roles");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading roles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDelete = async (roleId: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;

        try {
            const res = await fetch(`/api/admin/roles/${roleId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Role deleted successfully");
                fetchRoles();
            } else {
                toast.error("Failed to delete role");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-[#fef7f5] dark:bg-[#1f1e2a] text-[#1f1e2a] dark:text-white flex transition-colors duration-500">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <AdminSidebar activeTab="roles" />

            {/* Main Content */}
            <div className="flex-1 md:ml-72 transition-all duration-500">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1f1e2a]/5 dark:border-white/5 bg-white/80 dark:bg-[#121212]/80 px-6 py-5 backdrop-blur-xl md:px-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">Start Managing Roles</h1>
                        <p className="text-sm font-medium text-[#5d5b66] dark:text-gray-400 mt-1">Create, edit, and manage user roles and experiences.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <ThemeToggle />
                    </div>
                </header>

                <main className="px-6 py-8 md:px-10 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[#1f1e2a] dark:text-white">All Roles</h2>
                        <PrimaryButton label="Add Role" href="/admin/roles/add" icon={IconBolt} />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <IconBolt className="h-8 w-8 text-[#ff4c2b] animate-spin" />
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] bg-white dark:bg-[#2a2935] p-8 shadow-sm border border-[#1f1e2a]/5 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[#1f1e2a]/5 dark:border-white/5">
                                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Role & Org</th>
                                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">User</th>
                                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Identity</th>
                                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Duration</th>
                                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Mode</th>
                                            <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1f1e2a]/5 dark:divide-white/5">
                                        {roles.map((role) => (
                                            <tr key={role._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-4">
                                                    <div>
                                                        <p className="font-bold text-[#1f1e2a] dark:text-white">{role.title}</p>
                                                        <p className="text-xs text-[#5d5b66] dark:text-gray-400">{role.organization}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div>
                                                        <p className="font-medium text-[#1f1e2a] dark:text-white">{role.userId?.fullName || "Deleted User"}</p>
                                                        <p className="text-xs text-[#5d5b66] dark:text-gray-400">{role.userId?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-white/10 px-2 py-1 text-xs font-bold text-[#5d5b66] dark:text-gray-300">
                                                        {role.identityId?.slug || "-"}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-sm font-medium text-[#5d5b66] dark:text-gray-400">
                                                    {format(new Date(role.startDate), "MMM yyyy")} - {role.endDate ? format(new Date(role.endDate), "MMM yyyy") : "Present"}
                                                </td>
                                                <td className="py-4">
                                                    <span className="capitalize inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        {role.workMode}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/roles/${role._id}`} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 transition-colors">
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(role._id)}
                                                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {roles.length === 0 && (
                                    <div className="text-center py-12 text-[#5d5b66] dark:text-gray-400">
                                        No roles found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
