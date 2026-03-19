import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, User } from 'lucide-react';
import { useState } from 'react';

export default function UserManagement() {
  const { data: adminStats } = trpc.analytics.getUserStats.useQuery();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Note: In a real implementation, you would fetch the list of users
  // For now, we'll show the stats and placeholder for user management

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Total Users</p>
              <p className="text-3xl font-bold">{adminStats?.total || 0}</p>
            </div>
            <User className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Administrators</p>
              <p className="text-3xl font-bold">{adminStats?.admins || 0}</p>
            </div>
            <Shield className="w-12 h-12 text-purple-600 opacity-20" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Regular Users</p>
              <p className="text-3xl font-bold">{adminStats?.users || 0}</p>
            </div>
            <User className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </Card>
      </div>

      {/* User List Placeholder */}
      <Card className="p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">User List</h2>
          <p className="text-gray-600 mb-4">
            User management interface is being developed. You can view user statistics above.
          </p>
          <p className="text-sm text-gray-500">
            Features coming soon: User search, role management, account deactivation
          </p>
        </div>
      </Card>

      {/* User Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Promote User to Admin</h3>
          <p className="text-gray-600 mb-4">Select a user to promote them to administrator role</p>
          <Button disabled className="w-full">Coming Soon</Button>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Deactivate User Account</h3>
          <p className="text-gray-600 mb-4">Deactivate a user account to restrict access</p>
          <Button disabled className="w-full">Coming Soon</Button>
        </Card>
      </div>
    </div>
  );
}
