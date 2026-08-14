export const DashboardMetricsConfig = [
  {
    id: 'saved_universities',
    title: 'Saved Universities',
    icon: '🏫',
    iconBgColor: 'rgba(34, 211, 238, 0.1)',
    iconColor: 'var(--primary-cyan)',
    getValue: (data) => data.wishlist?.length || 0,
  },
  {
    id: 'active_applications',
    title: 'Active Applications',
    icon: '📋',
    iconBgColor: 'rgba(167, 139, 250, 0.1)',
    iconColor: 'var(--primary-purple)',
    getValue: (data) => data.applications?.filter(app => app.status !== 'Rejected' && app.status !== 'Accepted').length || 0,
  },
  {
    id: 'scholarships_found',
    title: 'Scholarships Found',
    icon: '🎓',
    iconBgColor: 'rgba(16, 185, 129, 0.1)',
    iconColor: 'var(--primary-green)',
    getValue: (data) => data.scholarships?.total || 0,
  },
  {
    id: 'budget_progress',
    title: 'Budget Progress',
    icon: '💰',
    iconBgColor: 'rgba(245, 158, 11, 0.1)',
    iconColor: 'var(--warning)',
    getValue: (data) => {
      const budget = data.profile?.budget;
      const wishlist = data.wishlist;
      if (!budget) return 'Not set';
      if (!wishlist || wishlist.length === 0) return '0%';
      
      const totalCost = wishlist.reduce((acc, item) => {
        const tuition = item.university?.tuitionFee || 0;
        const living = item.university?.livingCost || 0;
        return acc + tuition + living;
      }, 0);
      
      const avgCost = totalCost / wishlist.length;
      const progress = (avgCost / budget) * 100;
      return `${Math.round(progress)}%`;
    },
  }
];

export const StatusBadgeMap = {
  'Pending': { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
  'Accepted': { color: 'var(--primary-green)', bg: 'rgba(16, 185, 129, 0.1)' },
  'Rejected': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  'Interview': { color: 'var(--primary-cyan)', bg: 'rgba(34, 211, 238, 0.1)' },
};

export const getGreetingRule = (firstName) => {
  if (!firstName) return 'Welcome back!';
  
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${firstName}`;
  if (hour < 18) return `Good Afternoon, ${firstName}`;
  return `Good Evening, ${firstName}`;
};
