import React, { useState } from "react";
import { Bell, Shield, Globe, Moon, Sun, Smartphone, Mail } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useLanguage } from "../../../contexts/LanguageContext";
import { T } from "../../T";

export default function SettingsPanel() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: true,
    });
    
    const { isDark, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    // Handle dark mode toggle
    const handleDarkModeToggle = () => {
        toggleTheme();
    };

    // Handle language change
    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100"><T>Settings</T></h1>
                <p className="text-slate-600 dark:text-slate-400">
                    <T>Manage your account preferences</T>
                </p>
            </div>

            {/* Notifications Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-8 py-6 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 rounded-xl p-2">
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100"><T>Notifications</T></h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1"><T>Manage notification preferences</T></p>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Mail className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100"><T>Email Notifications</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Receive order updates via email</T></p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                                <Smartphone className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100"><T>Push Notifications</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Get instant mobile notifications</T></p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 rounded-lg p-2">
                                <Smartphone className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100"><T>SMS Notifications</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Receive important updates via SMS</T></p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.sms}
                                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-8 py-6 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-600 rounded-xl p-2">
                            {isDark ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100"><T>Appearance</T></h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1"><T>Customize your visual experience</T></p>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${isDark ? 'bg-slate-800' : 'bg-amber-100'}`}>
                                {isDark ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-amber-600" />}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100"><T>Dark Mode</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Switch between light and dark themes</T></p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={handleDarkModeToggle}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100"><T>Language</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Choose your preferred language</T></p>
                            </div>
                        </div>
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                        >
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                            <option value="hy">Հայերեն</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-8 py-6 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 rounded-xl p-2">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100"><T>Security</T></h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1"><T>Protect your account and data</T></p>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 space-y-6">
                    <button className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600"><T>Change Password</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Update your account password</T></p>
                            </div>
                            <div className="text-slate-400 group-hover:text-blue-600">
                                →
                            </div>
                        </div>
                    </button>

                    <button className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600"><T>Two-Factor Authentication</T></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400"><T>Add extra security to your account</T></p>
                            </div>
                            <div className="text-slate-400 group-hover:text-blue-600">
                                →
                            </div>
                        </div>
                    </button>

                    <button className="w-full text-left p-4 rounded-xl border border-red-200 hover:bg-red-50 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-600"><T>Delete Account</T></p>
                                <p className="text-sm text-red-500"><T>Permanently delete your account and data</T></p>
                            </div>
                            <div className="text-red-400 group-hover:text-red-600">
                                →
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}