import React, { useState } from 'react';
import Link from 'next/link';
import { 
  //BarChart3, 
  Users, 
  FileText, 
  Calendar, 
  Store, 
  //MessageSquare, 
  //Settings,
  TrendingUp,
  //AlertCircle,
  // CheckCircle,
  // Clock,
  // Eye,
  Plus,
  // Filter,
  // Download,
  // Search,
  // Bell,
  ChevronRight,
  Activity,
  // Globe,
  // MapPin,
  BookOpen,
  Contact
} from 'lucide-react';

// Import hooks
import { usePosts } from '@/hooks/usePostsQuery';
import { useEvents } from '@/hooks/useEvents';
import { useUMKM } from '@/hooks/useUMKM';
import { useUsers } from '@/hooks/useUsers';
import { useContacts } from '@/hooks/useContacts';
import { useServiceGuides } from '@/hooks/useServiceGuides';

const recentActivities = [
  {
    id: 1,
    type: 'post',
    title: 'Post baru "Bantuan Sosial" dipublish',
    user: 'Admin Desa',
    timestamp: '2 menit yang lalu',
    status: 'success'
  },
  {
    id: 2,
    type: 'service',
    title: 'Service guide baru ditambahkan',
    user: 'Staff Desa',
    timestamp: '15 menit yang lalu',
    status: 'pending'
  },
  {
    id: 3,
    type: 'umkm',
    title: 'UMKM "Warung Mak Ijah" terdaftar',
    user: 'Siti Aminah',
    timestamp: '1 jam yang lalu',
    status: 'success'
  },
  {
    id: 4,
    type: 'event',
    title: 'Event "Gotong Royong" dijadwalkan',
    user: 'Kepala Desa',
    timestamp: '2 jam yang lalu',
    status: 'info'
  }
];

const pendingTasks = [
  {
    id: 1,
    title: 'Review 3 post draft',
    priority: 'high',
    dueDate: 'Hari ini'
  },
  {
    id: 2,
    title: 'Verifikasi 5 UMKM baru',
    priority: 'medium',
    dueDate: 'Besok'
  },
  {
    id: 3,
    title: 'Update service guides',
    priority: 'high',
    dueDate: 'Hari ini'
  },
  {
    id: 4,
    title: 'Update village profile',
    priority: 'low',
    dueDate: 'Minggu ini'
  }
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: React.ComponentType<any>;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  color = 'blue' 
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm font-medium text-green-600">{trend}</span>
          <span className="text-sm text-gray-500 ml-1">dari bulan lalu</span>
        </div>
      )}
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  color?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  color = 'blue' 
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 hover:bg-blue-50 border-blue-200',
    green: 'text-green-600 hover:bg-green-50 border-green-200',
    purple: 'text-purple-600 hover:bg-purple-50 border-purple-200',
    yellow: 'text-yellow-600 hover:bg-yellow-50 border-yellow-200'
  };

  return (
    <Link
      href={href}
      className={`flex items-center p-3 bg-white border rounded-lg hover:shadow-sm transition-all ${colorClasses[color]}`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

interface ActivityItemProps {
  activity: {
    id: number;
    type: string;
    title: string;
    user: string;
    timestamp: string;
    status: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.info;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      post: FileText,
      service: BookOpen,
      umkm: Store,
      event: Calendar,
      contact: Contact
    };
    const Icon = icons[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1">
        {getTypeIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <div className="flex items-center mt-1 space-x-2">
          <p className="text-xs text-gray-500">oleh {activity.user}</p>
          <span className="text-xs text-gray-300">•</span>
          <p className="text-xs text-gray-500">{activity.timestamp}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
          {activity.status === 'success' ? 'Selesai' : 
           activity.status === 'pending' ? 'Pending' : 
           activity.status === 'info' ? 'Info' : 'Error'}
        </span>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    priority: string;
    dueDate: string;
  };
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority];
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{task.title}</p>
        <p className="text-xs text-gray-500 mt-1">Deadline: {task.dueDate}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(task.priority)}`}>
          {task.priority === 'high' ? 'Tinggi' : 
           task.priority === 'medium' ? 'Sedang' : 'Rendah'}
        </span>
        <button className="text-blue-600 hover:text-blue-700">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7d');

  // Menggunakan hooks untuk mengambil data
  const { data: postsData, isLoading: postsLoading } = usePosts({ 
    page: 1, 
    limit: 100,
    status: null
  });

  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    page: 1,
    limit: 100
  });

  const { data: umkmData, isLoading: umkmLoading } = useUMKM({
    page: 1,
    limit: 100
  });

  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: 1,
    limit: 100
  });

  const { data: contactsData, isLoading: contactsLoading } = useContacts({
    page: 1,
    limit: 100
  });

  const { data: serviceGuidesData, isLoading: serviceGuidesLoading } = useServiceGuides({
    page: 1,
    limit: 100
  });

  // Hitung statistik dari data yang diambil
  const publishedPosts = postsData?.data?.filter((post: any) => post.status === 'PUBLISHED').length || 0;
  const draftPosts = postsData?.data?.filter((post: any) => post.status === 'DRAFT').length || 0;
  const totalPosts = postsData?.meta?.total || postsData?.data?.length || 0;

  const totalEvents = eventsData?.meta?.total || eventsData?.data?.length || 0;
  const upcomingEvents = eventsData?.data?.filter((event: any) => 
    new Date(event.startDate) > new Date()
  ).length || 0;

  const totalUMKM = umkmData?.meta?.total || umkmData?.data?.length || 0;
  const verifiedUMKM = umkmData?.data?.filter((umkm: any) => umkm.verified).length || 0;

  const totalUsers = usersData?.meta?.total || usersData?.data?.length || 0;
  const activeUsers = usersData?.data?.filter((user: any) => user.isActive).length || 0;

  const totalContacts = contactsData?.meta?.total || contactsData?.data?.length || 0;
  const totalServiceGuides = serviceGuidesData?.meta?.total || serviceGuidesData?.data?.length || 0;

  // Mock data untuk visitors
  const mockVisitors = {
    today: 1247,
    thisMonth: 28945,
    trend: '+23%'
  };

  if (postsLoading || eventsLoading || umkmLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Selamat datang kembali! Berikut ringkasan aktivitas website desa.
            </p>
          </div>
          
          {/* <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1d">Hari ini</option>
              <option value="7d">7 hari</option>
              <option value="30d">30 hari</option>
              <option value="90d">90 hari</option>
            </select>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Laporan
            </button>
          </div> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers}
            subtitle={`${activeUsers} aktif`}
            trend="+12%"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Posts"
            value={totalPosts}
            subtitle={`${publishedPosts} published`}
            trend="+5%"
            icon={FileText}
            color="green"
          />
          <StatCard
            title="Events"
            value={totalEvents}
            subtitle={`${upcomingEvents} mendatang`}
            trend="+3%"
            icon={Calendar}
            color="purple"
          />
          <StatCard
            title="UMKM"
            value={totalUMKM}
            subtitle={`${verifiedUMKM} terverifikasi`}
            trend="+8%"
            icon={Store}
            color="yellow"
          />
          {/* <StatCard
            title="Service Guides"
            value={totalServiceGuides}
            subtitle="Panduan layanan"
            trend="+4%"
            icon={BookOpen}
            color="red"
          /> */}
          <StatCard
            title="Contacts"
            value={totalContacts}
            subtitle="Data kontak"
            trend="+2%"
            icon={Contact}
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              icon={Plus}
              label="Buat Post Baru"
              href="/admin/posts/create"
              color="blue"
            />
            <QuickActionButton
              icon={Calendar}
              label="Tambah Event"
              href="/admin/events/create"
              color="green"
            />
            <QuickActionButton
              icon={Store}
              label="Daftar UMKM"
              href="/admin/umkm/create"
              color="purple"
            />
            <QuickActionButton
              icon={BookOpen}
              label="Tambah Layanan"
              href="/admin/layanan/create"
              color="yellow"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          {/* <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Lihat Semua
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-1">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            {/* <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Tugas Pending</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {pendingTasks.filter(t => t.priority === 'high').length} Urgent
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div> */}

            {/* System Status */}
            {/* <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Status Sistem</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900">Database</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900">API Server</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-900">Backup</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">2 jam lalu</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-900">Storage</span>
                    </div>
                    <span className="text-sm font-medium text-red-600">85% penuh</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Quick Stats */}
            {/* <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Statistik Cepat</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pengunjung hari ini</span>
                    <span className="text-sm font-medium text-gray-900">{mockVisitors.today.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Post terpopuler</span>
                    <span className="text-sm font-medium text-gray-900">2.3k views</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">User baru minggu ini</span>
                    <span className="text-sm font-medium text-gray-900">+12</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Draft posts</span>
                    <span className="text-sm font-medium text-gray-900">{draftPosts}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total contacts</span>
                    <span className="text-sm font-medium text-gray-900">{totalContacts}</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}