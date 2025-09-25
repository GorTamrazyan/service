// admin/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Mail, Phone, MapPin, Calendar, Eye, UserCheck, UserX, Trash2, Filter } from "lucide-react";
import { T } from "../../components/T";
import { 
    getAllUsers, 
    updateUserStatus, 
    deleteUser, 
    searchUsers,
    getUsersStats,
    User 
} from "../../lib/firebase/users";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        newUsersThisMonth: 0
    });

    useEffect(() => {
        loadUsers();
        loadStats();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchQuery, statusFilter]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Error loading users:", error);
            setError("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await getUsersStats();
            setStats(statsData);
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(user => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    user.email.toLowerCase().includes(searchLower) ||
                    user.firstName?.toLowerCase().includes(searchLower) ||
                    user.lastName?.toLowerCase().includes(searchLower) ||
                    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
                );
            });
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(user => {
                switch (statusFilter) {
                    case "active": return user.isActive;
                    case "inactive": return !user.isActive;
                    case "verified": return user.emailVerified;
                    case "unverified": return !user.emailVerified;
                    default: return true;
                }
            });
        }

        setFilteredUsers(filtered);
    };

    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        try {
            await updateUserStatus(userId, newStatus);
            loadUsers();
            loadStats();
        } catch (error: any) {
            console.error("Error updating user status:", error);
            setError(error.message || "Failed to update user status");
        }
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (confirm(`Are you sure you want to delete user "${userEmail}"?`)) {
            try {
                await deleteUser(userId);
                loadUsers();
                loadStats();
            } catch (error: any) {
                console.error("Error deleting user:", error);
                setError(error.message || "Failed to delete user");
            }
        }
    };

    const getFullName = (user: User) => {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user.firstName || user.lastName || "No name";
    };

    const getAddress = (user: User) => {
        if (!user.address) return "No address";
        const { street, houseNumber, city } = user.address;
        if (street && houseNumber && city) {
            return `${street} ${houseNumber}, ${city}`;
        }
        return "Incomplete address";
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                        <T>Users Management</T>
                    </h1>
                    <p className="text-[var(--color-text)]/70 mt-1">
                        <T>Manage user accounts and information</T>
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--color-background)] border border-[var(--color-text)]/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text)]/60"><T>Total Users</T></p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                
                <div className="bg-[var(--color-background)] border border-[var(--color-text)]/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text)]/60"><T>Active Users</T></p>
                            <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                        </div>
                        <UserCheck className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                
                <div className="bg-[var(--color-background)] border border-[var(--color-text)]/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text)]/60"><T>Verified Users</T></p>
                            <p className="text-2xl font-bold text-[var(--color-accent)]">{stats.verifiedUsers}</p>
                        </div>
                        <Mail className="w-8 h-8 text-[var(--color-accent)]" />
                    </div>
                </div>
                
                <div className="bg-[var(--color-background)] border border-[var(--color-text)]/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text)]/60"><T>New This Month</T></p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.newUsersThisMonth}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-3 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] cursor-pointer min-w-[200px]"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active Users</option>
                            <option value="inactive">Inactive Users</option>
                            <option value="verified">Verified Users</option>
                            <option value="unverified">Unverified Users</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--color-secondary)]">
                            <tr>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>User</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Contact</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Address</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Status</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Joined</T>
                                </th>
                                <th className="text-center p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Actions</T>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr 
                                    key={user.id}
                                    className={`border-t border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/20 transition-colors ${
                                        index % 2 === 0 ? 'bg-[var(--color-background)]' : 'bg-[var(--color-secondary)]/10'
                                    }`}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[var(--color-secondary)] rounded-full p-2">
                                                <Users className="w-5 h-5 text-[var(--color-accent)]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-primary)]">
                                                    {getFullName(user)}
                                                </p>
                                                <p className="text-sm text-[var(--color-text)]/60">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-[var(--color-text)]/50" />
                                                <span className={user.emailVerified ? 'text-green-600' : 'text-red-600'}>
                                                    {user.emailVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-[var(--color-text)]/70">
                                                    <Phone className="w-4 h-4 text-[var(--color-text)]/50" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text)]/70">
                                            <MapPin className="w-4 h-4 text-[var(--color-text)]/50" />
                                            <span>{getAddress(user)}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            user.isActive
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm text-[var(--color-text)]/60">
                                            {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(user.id, !user.isActive)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    user.isActive 
                                                        ? 'hover:bg-red-100 text-red-600' 
                                                        : 'hover:bg-green-100 text-green-600'
                                                }`}
                                            >
                                                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-[var(--color-text)]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--color-text)]/70 mb-2">
                        <T>No users found</T>
                    </h3>
                    <p className="text-[var(--color-text)]/50">
                        <T>Try adjusting your search or filters</T>
                    </p>
                </div>
            )}
        </div>
    );
}