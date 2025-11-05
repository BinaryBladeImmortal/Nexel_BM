import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Edit, Crown, User, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ApiService from '@/services/api';
import GlitchText from '@/components/GlitchText';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  console.log('👥 AdminUsers component rendering');

  // Fetch all users
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔑 Fetching admin users...');
      const token = localStorage.getItem('token');
      try {
        const result = await ApiService.getAdminUsers(token || '');
        console.log('✅ Users data received:', result);
        return result;
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }
    }
  });

  if (error) {
    console.error('❌ Users query error:', error);
  }

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem('token');
      return ApiService.deleteAdminUser(userId, token || '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      const token = localStorage.getItem('token');
      return ApiService.updateAdminUser(userId, updates, token || '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "User updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  });

  const handleDeleteUser = (userId: string | number, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      deleteUserMutation.mutate(String(userId));
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    updateUserMutation.mutate({
      userId: selectedUser.id,
      updates: {
        role: selectedUser.role,
        subscription: selectedUser.subscriptionPlan || selectedUser.subscription?.plan,
        xp: selectedUser.xp,
        level: selectedUser.level
      }
    });
  };

  const users = data?.users || [];
  const filteredUsers = users.filter((user: any) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-orbitron font-bold title-orbitron mb-2">
          <GlitchText text="User Management" />
        </h1>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-3xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Admin Users</p>
          <p className="text-3xl font-bold text-primary">
            {users.filter((u: any) => u.role === 'admin').length}
          </p>
        </div>
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Filtered Results</p>
          <p className="text-3xl font-bold text-primary">{filteredUsers.length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="gradient-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">XP</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filteredUsers.map((user: any) => (
                   <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         {user.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                         <span className="font-medium">{user.username}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${
                         user.role === 'admin'
                           ? 'bg-yellow-500/20 text-yellow-500'
                           : 'bg-blue-500/20 text-blue-500'
                       }`}>
                         {user.role || 'user'}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className="text-sm text-muted-foreground">
                         {user.subscriptionPlan || 'Free'}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">{user.xp || 0}</td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">{user.level || 1}</td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">
                       {new Date(user.createdAt).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center justify-end gap-2">
                         <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => handleEditUser(user)}
                           className="text-primary hover:bg-primary/10"
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => handleDeleteUser(user.id, user.username)}
                           disabled={deleteUserMutation.isPending}
                           className="text-red-500 hover:bg-red-500/10"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron">Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={selectedUser.username} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  value={selectedUser.role || 'user'}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <select
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  value={selectedUser.subscriptionPlan || 'Free'}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    subscriptionPlan: e.target.value
                  })}
                >
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
                  <option value="Power">Power</option>
                  <option value="Ultra">Ultra</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>XP</Label>
                  <Input
                    type="number"
                    value={selectedUser.xp || 0}
                    onChange={(e) => setSelectedUser({ ...selectedUser, xp: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Input
                    type="number"
                    value={selectedUser.level || 1}
                    onChange={(e) => setSelectedUser({ ...selectedUser, level: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-gradient-primary"
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
