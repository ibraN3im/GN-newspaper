import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { apiService } from "../services/api";
import type { User } from "../services/api";
import { User as UserIcon, Plus, Shield } from "lucide-react";

export function Users() {
    const { t } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getUsers();
            // Show all users (admins, editors, writers)
            setUsers(data || []);
            setError("");
        } catch (err) {
            setError(t("فشل تحميل الأعضاء", "Failed to load members"));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("هل أنت متأكد من حذف هذا العضو؟", "Are you sure you want to delete this member?"))) {
            return;
        }

        try {
            await apiService.deleteUser(id);
            await loadUsers();
        } catch (err) {
            setError(t("فشل حذف العضو", "Failed to delete member"));
            console.error(err);
        }
    };

    const handleAddUser = async (userData: any) => {
        try {
            if (editingUser) {
                await apiService.updateUser(editingUser._id, userData);
            } else {
                await apiService.createUser(userData);
            }
            setShowAddModal(false);
            setEditingUser(null);
            await loadUsers();
        } catch (err) {
            setError(t("فشل حفظ المستخدم", "Failed to save user"));
            console.error(err);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-base sm:text-xl my-2 font-bold text-red-800">{t("الأعضاء", "Members")}</h1>
                    <p className="text-gray-600 text-sm sm:text-base">{t("إدارة أعضاء الموقع وصلاحياتهم", "Manage site members and their permissions")}</p>
                </div>
                <button

                    onClick={() => setShowAddModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    {t("إضافة عضو", "Add Member")}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">{t("جاري التحميل...", "Loading...")}</div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">{t("لا توجد أعضاء", "No members found")}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        {t("الاسم", "Name")}
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                                        {t("البريد الإلكتروني", "Email")}
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                                        {t("الدور", "Role")}
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        {t("الإجراءات", "Actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-red-100 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                </div>
                                                <div className="mr-2 sm:mr-4 min-w-0">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                                            {user.email}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : user.role === 'editor'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                <Shield className="w-3 h-3 mr-1" />
                                                {user.role === 'admin'
                                                    ? t('مدير', 'Admin')
                                                    : user.role === 'editor'
                                                        ? t('كاتب', 'Editor')
                                                        : t('محرر', 'Editor')}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setShowAddModal(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 mx-2 sm:mx-4 inline-block cursor-pointer"
                                            >
                                                {t("تعديل", "Edit")}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-600 hover:text-red-900 mx-2 sm:mx-4 inline-block cursor-pointer"
                                            >
                                                {t("حذف", "Delete")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showAddModal && (
                <UserFormModal
                    user={editingUser}
                    onSave={handleAddUser}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingUser(null);
                    }}
                />
            )}
        </div>
    );
}

interface UserFormModalProps {
    user: User | null;
    onSave: (data: any) => void;
    onClose: () => void;
}

function UserFormModal({ user, onSave, onClose }: UserFormModalProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'editor',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold mb-4 text-red-600">
                    {user ? t("تعديل المستخدم", "Edit User") : t("إضافة مستخدم", "Add User")}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("الاسم", "Name")}
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("البريد الإلكتروني", "Email")}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            dir="ltr"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("كلمة المرور", "Password")}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            dir="ltr"
                            placeholder={user ? t("اترك فارغاً للحفاظ على الحالية", "Leave blank to keep current") : ""}
                        />
                        {user && (
                            <p className="text-xs text-gray-500 mt-1">
                                {t("اترك الحقل فارغاً إذا كنت لا تريد تغيير كلمة المرور", "Leave field empty if you don't want to change password")}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("الدور", "Role")}
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="admin">{t("مدير", "Admin")}</option>
                            <option value="editor">{t("كاتب", "Editor")}</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-red-600 text-white text-sm md:text-base p-2 md:p-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            {user ? t("حفظ التعديلات", "Save Changes") : t("إضافة", "Add")}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-sm md:text-base text-gray-700 p-2 md:p-4 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            {t("إلغاء", "Cancel")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
