"use client";

import React, { useState, useEffect } from "react";
import { UserCog, Plus, ToggleLeft, ToggleRight, X, Eye, EyeOff, Pencil } from "lucide-react";
import AdminProtection from "../components/AdminProtection";
import {
    getAllAdmins,
    createAdminUser,
    updateAdminPermissions,
    toggleAdminStatus,
    AdminUser,
} from "../../lib/firebase/admin";

// Each page and which permission it requires
const ALL_PAGES = [
    { label: "Products",     permission: "manage_products" },
    { label: "Services",     permission: "manage_products" },
    { label: "Consultation", permission: "manage_orders" },
    { label: "Orders",       permission: "manage_orders" },
    { label: "Users",        permission: "manage_users" },
    { label: "Admins",       permission: "manage_admins" },
    { label: "Settings",     permission: "manage_settings" },
];

// Derive unique permissions from selected page labels
function permissionsFromPages(selectedPages: string[]): string[] {
    const perms = new Set<string>();
    ALL_PAGES.forEach((p) => {
        if (selectedPages.includes(p.label)) perms.add(p.permission);
    });
    return Array.from(perms);
}

// Derive which pages are accessible from a permissions array
function pagesFromPermissions(permissions: string[]): string[] {
    return ALL_PAGES.filter((p) => permissions.includes(p.permission)).map((p) => p.label);
}

const ROLE_COLORS: Record<AdminUser["role"], string> = {
    super_admin: "bg-purple-100 text-purple-800",
    admin:       "bg-blue-100 text-blue-800",
    moderator:   "bg-green-100 text-green-800",
};

const DEFAULT_PAGES_BY_ROLE: Record<AdminUser["role"], string[]> = {
    super_admin: ["Products", "Services", "Consultation", "Orders", "Users", "Admins", "Settings"],
    admin:       ["Products", "Services", "Consultation", "Orders", "Users"],
    moderator:   ["Orders", "Users"],
};

export default function AdminsPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");

    // Create modal
    const [showCreate, setShowCreate] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        role: "admin" as AdminUser["role"],
        selectedPages: DEFAULT_PAGES_BY_ROLE["admin"],
    });

    // Edit modal
    const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
    const [editRole, setEditRole] = useState<AdminUser["role"]>("admin");
    const [editPages, setEditPages] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadAdmins(); }, []);

    const loadAdmins = async () => {
        try {
            setAdmins(await getAllAdmins());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // ── Create ────────────────────────────────────────────────
    const openCreate = () => {
        setCreateError("");
        setForm({ email: "", username: "", password: "", role: "admin", selectedPages: DEFAULT_PAGES_BY_ROLE["admin"] });
        setShowCreate(true);
    };

    const toggleCreatePage = (label: string) => {
        setForm((p) => ({
            ...p,
            selectedPages: p.selectedPages.includes(label)
                ? p.selectedPages.filter((l) => l !== label)
                : [...p.selectedPages, label],
        }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        try {
            const permissions = permissionsFromPages(form.selectedPages);
            await createAdminUser(form.email, form.username, form.role, form.password, permissions);
            setSuccess(`Admin created! Verification email sent to ${form.email}`);
            setShowCreate(false);
            await loadAdmins();
        } catch (err: any) {
            setCreateError(err.message || "Failed to create admin");
        } finally {
            setCreating(false);
        }
    };

    // ── Edit ──────────────────────────────────────────────────
    const openEdit = (admin: AdminUser) => {
        setEditAdmin(admin);
        setEditRole(admin.role);
        setEditPages(pagesFromPermissions(admin.permissions));
    };

    const toggleEditPage = (label: string) => {
        setEditPages((p) =>
            p.includes(label) ? p.filter((l) => l !== label) : [...p, label]
        );
    };

    const handleSaveEdit = async () => {
        if (!editAdmin) return;
        setSaving(true);
        try {
            await updateAdminPermissions(editAdmin.id, editRole, permissionsFromPages(editPages));
            setEditAdmin(null);
            await loadAdmins();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    // ── Toggle active ─────────────────────────────────────────
    const handleToggleStatus = async (admin: AdminUser) => {
        if (admin.role === "super_admin" && admin.isActive) {
            const activeSuperAdmins = admins.filter((a) => a.role === "super_admin" && a.isActive);
            if (activeSuperAdmins.length <= 1) {
                alert("Cannot deactivate the last active super admin.");
                return;
            }
        }
        try {
            await toggleAdminStatus(admin.id, !admin.isActive);
            await loadAdmins();
        } catch (e) {
            console.error(e);
        }
    };

    // ── Render ────────────────────────────────────────────────
    return (
        <AdminProtection requiredPermission="manage_admins">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <UserCog className="w-8 h-8 text-[var(--color-accent)]" />
                        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Admin Management</h1>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" /> Add Admin
                    </button>
                </div>

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                        {success}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-[var(--color-text)]/60">Loading admins...</div>
                ) : (
                    <div className="bg-[var(--color-background)] rounded-2xl border border-[var(--color-text)]/10 overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-[var(--color-secondary)]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wider">Page Access</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-text)]/10">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-[var(--color-secondary)]/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-[var(--color-text)]">{admin.username}</p>
                                            <p className="text-sm text-[var(--color-text)]/60">{admin.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${ROLE_COLORS[admin.role]}`}>
                                                {admin.role === "super_admin" ? "Super Admin" : admin.role === "admin" ? "Admin" : "Moderator"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                <span className="px-2 py-0.5 bg-[var(--color-secondary)] text-[var(--color-text)]/70 text-xs rounded-full">Dashboard</span>
                                                {pagesFromPermissions(admin.permissions).map((page) => (
                                                    <span key={page} className="px-2 py-0.5 bg-[var(--color-secondary)] text-[var(--color-text)]/70 text-xs rounded-full">
                                                        {page}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {admin.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEdit(admin)}
                                                    title="Edit access"
                                                    className="text-[var(--color-text)]/50 hover:text-[var(--color-accent)] transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(admin)}
                                                    title={admin.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    {admin.isActive
                                                        ? <ToggleRight className="w-6 h-6 text-green-500" />
                                                        : <ToggleLeft className="w-6 h-6 text-red-400" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Create Modal ────────────────────────────────── */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--color-text)]/10">
                            <h2 className="text-xl font-bold text-[var(--color-primary)]">Add New Admin</h2>
                            <button onClick={() => setShowCreate(false)} className="text-[var(--color-text)]/50 hover:text-[var(--color-text)]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
                                <input
                                    type="email" required
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Username</label>
                                <input
                                    type="text" required
                                    value={form.username}
                                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                                    className="w-full px-3 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Temporary Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} required minLength={6}
                                        value={form.password}
                                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                        className="w-full px-3 py-2 pr-10 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/50">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Role (label)</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => {
                                        const r = e.target.value as AdminUser["role"];
                                        setForm((p) => ({ ...p, role: r, selectedPages: DEFAULT_PAGES_BY_ROLE[r] }));
                                    }}
                                    className="w-full px-3 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    Page Access
                                    <span className="text-[var(--color-text)]/50 font-normal ml-1">(Dashboard always included)</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ALL_PAGES.map((page) => (
                                        <label key={page.label} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={form.selectedPages.includes(page.label)}
                                                onChange={() => toggleCreatePage(page.label)}
                                                className="w-4 h-4 rounded accent-[var(--color-accent)]"
                                            />
                                            <span className="text-sm text-[var(--color-text)]">{page.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {createError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
                                    {createError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button" onClick={() => setShowCreate(false)}
                                    className="flex-1 px-4 py-2 border border-[var(--color-text)]/20 text-[var(--color-text)] rounded-xl hover:bg-[var(--color-secondary)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit" disabled={creating}
                                    className="flex-1 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Create & Send Email"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Edit Modal ──────────────────────────────────── */}
            {editAdmin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--color-text)]/10">
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-primary)]">Edit Access</h2>
                                <p className="text-sm text-[var(--color-text)]/60">{editAdmin.username} · {editAdmin.email}</p>
                            </div>
                            <button onClick={() => setEditAdmin(null)} className="text-[var(--color-text)]/50 hover:text-[var(--color-text)]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Role (label)</label>
                                <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value as AdminUser["role"])}
                                    className="w-full px-3 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    Page Access
                                    <span className="text-[var(--color-text)]/50 font-normal ml-1">(Dashboard always included)</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ALL_PAGES.map((page) => (
                                        <label key={page.label} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={editPages.includes(page.label)}
                                                onChange={() => toggleEditPage(page.label)}
                                                className="w-4 h-4 rounded accent-[var(--color-accent)]"
                                            />
                                            <span className="text-sm text-[var(--color-text)]">{page.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setEditAdmin(null)}
                                    className="flex-1 px-4 py-2 border border-[var(--color-text)]/20 text-[var(--color-text)] rounded-xl hover:bg-[var(--color-secondary)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit} disabled={saving}
                                    className="flex-1 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminProtection>
    );
}
