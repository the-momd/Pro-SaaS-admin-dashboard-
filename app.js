
const { useState, useEffect, useRef } = React;

// --- Helper Component: Safe Lucide Icon Wrapper ---
// این نسخه از تداخل ریکت و کتابخانه آیکون جلوگیری می‌کند
const Icon = ({ name, size = 24, className = "" }) => {
    const iconRef = useRef(null);

    useEffect(() => {
        if (iconRef.current) {
            // تبدیل نام‌ها مثل layout-dashboard به layoutDashboard
            const camelName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            const iconNode = lucide.icons[camelName];

            // پاک کردن محتوای قبلی برای جلوگیری از خطای ری‌اکت
            iconRef.current.innerHTML = '';

            if (iconNode) {
                // ساخت تگ SVG به صورت دستی
                const svg = lucide.createElement(iconNode);
                svg.setAttribute('width', size);
                svg.setAttribute('height', size);
                if (className) svg.setAttribute('class', className);
                
                iconRef.current.appendChild(svg);
            }
        }
    }, [name, size, className]);

    // ری‌اکت این تگ span را کنترل می‌کند و آیکون درون آن تزریق می‌شود
    return <span ref={iconRef} className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}></span>;
};

// --- Animated Theme Toggle Component ---
const AnimatedThemeToggle = ({ isDarkMode, onToggle }) => {
    return (
        <div className={`theme-toggle-wrapper ${isDarkMode ? 'theme-toggle-dark' : 'theme-toggle-light'}`} onClick={onToggle}>
            <div className="track-decor">
                <div className={`absolute left-2 top-2 w-3 h-1 bg-white/40 rounded-full transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`absolute right-3 top-4 w-4 h-1 bg-white/40 rounded-full transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`absolute right-2 top-2 w-1 h-1 bg-white/80 rounded-full transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute left-4 top-4 w-1 h-1 bg-white/60 rounded-full transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
            <div className={`theme-toggle-thumb ${isDarkMode ? 'thumb-dark' : 'thumb-light'}`}>
                <svg className="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                <svg className="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </div>
        </div>
    );
};

// --- Other Components ---
const Sparkline = ({ data, colorId, isPositive }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`).join(' ');
    const strokeColor = isPositive ? '#10B981' : '#EF4444'; 
    return (
        <svg viewBox="0 -5 100 110" className="w-24 h-10" preserveAspectRatio="none">
            <defs><linearGradient id={`grad-${colorId}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" /><stop offset="100%" stopColor={strokeColor} stopOpacity="0" /></linearGradient></defs>
            <polyline fill={`url(#grad-${colorId})`} points={`0,100 ${points} 100,100`} />
            <polyline fill="none" stroke={strokeColor} strokeWidth="2.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const SkeletonLoader = () => (
    <div className="p-8 w-full h-full space-y-8 animate-pulse bg-slate-50 dark:bg-slate-950">
        <div className="flex justify-between items-center mb-8"><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div><div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-full w-10"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (<div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-6 flex flex-col justify-between"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4"></div><div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div></div>))}
        </div>
    </div>
);

const ToggleSwitch = ({ label, description, defaultChecked = false }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
            <div><p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p></div>
            <button onClick={() => setChecked(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} /></button>
        </div>
    );
};

// --- Pages ---
const DashboardPage = () => {
    const [stats, setStats] = useState([
        { id: 'rev', title: 'Total Revenue', value: 124500, prefix: '$', change: 12.5, isPositive: true, sparkline: [30, 40, 35, 50, 49, 60, 70] },
        { id: 'usr', title: 'Active Users', value: 8432, prefix: '', change: 5.2, isPositive: true, sparkline: [20, 22, 28, 25, 30, 35, 33] },
        { id: 'ses', title: 'Server Load', value: 42, prefix: '', suffix: '%', change: -2.4, isPositive: true, sparkline: [60, 55, 65, 50, 45, 40, 42] },
        { id: 'con', title: 'Conversion Rate', value: 3.84, prefix: '', suffix: '%', change: -1.1, isPositive: false, sparkline: [4.2, 4.0, 4.1, 3.9, 3.7, 3.9, 3.84] },
    ]);
    const [chartData, setChartData] = useState([65, 45, 80, 55, 90, 75, 110]);
    const [flashingStatId, setFlashingStatId] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const statIndex = Math.floor(Math.random() * stats.length);
            setStats(prev => prev.map((stat, idx) => {
                if (idx === statIndex) {
                    const fluctuation = stat.value * (Math.random() * 0.05 - 0.02);
                    let newValue = stat.value + fluctuation;
                    newValue = (stat.id === 'con' || stat.id === 'ses') ? Number(newValue.toFixed(2)) : Math.round(newValue);
                    return { ...stat, value: newValue, sparkline: [...stat.sparkline.slice(1), newValue] };
                }
                return stat;
            }));
            setChartData(prev => [...prev.slice(1), Math.floor(Math.random() * 60) + 40]);
            setFlashingStatId(stats[statIndex].id);
            setTimeout(() => setFlashingStatId(null), 300);
        }, 3500);
        return () => clearInterval(interval);
    }, [stats]);

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Monitor your metrics in real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">Export Data</button>
                    <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-colors">Generate Report</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={stat.id} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between relative overflow-hidden group animate-slide-up delay-${(index + 1) * 100}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <h3 className={`text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight ${flashingStatId === stat.id ? (stat.isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400') : ''}`}>
                                        {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                                    </h3>
                                </div>
                            </div>
                            <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${stat.isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                                <Icon name={stat.isPositive ? 'arrow-up-right' : 'arrow-down-right'} size={20} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                            <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-bold ${stat.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{stat.change > 0 ? '+' : ''}{stat.change}%</span>
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">vs last month</span>
                            </div>
                            <div className="w-20 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Sparkline data={stat.sparkline} colorId={stat.id} isPositive={stat.isPositive} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 xl:col-span-2 animate-slide-up delay-200">
                    <div className="flex items-center justify-between mb-8">
                        <div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Revenue Analytics</h2></div>
                        <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2 outline-none">
                            <option>This Week</option><option>Last Month</option>
                        </select>
                    </div>
                    <div className="h-[300px] flex items-end justify-between gap-3 relative px-2">
                        <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                            {[1,2,3,4,5].map(i => <div key={i} className="border-b border-slate-100 dark:border-slate-800 w-full h-0 border-dashed"></div>)}
                        </div>
                        {chartData.map((height, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-3 group z-10 h-full justify-end">
                                <div className="w-full max-w-[3rem] h-full flex items-end relative rounded-t-lg">
                                    <div className="w-full bg-indigo-100 dark:bg-indigo-900/40 rounded-t-lg relative overflow-hidden transition-all duration-700 ease-out group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60" style={{ height: `${height}%` }}>
                                        <div className="absolute bottom-0 w-full bg-indigo-500 dark:bg-indigo-500 rounded-t-lg" style={{ height: `${height * 0.6}%` }} />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 flex flex-col animate-slide-up delay-300">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Activity Feed</h2>
                    <div className="flex-1 relative">
                        <div className="absolute top-2 bottom-2 left-[19px] w-px bg-slate-100 dark:bg-slate-800"></div>
                        <div className="space-y-6 relative z-10">
                            {[
                                { icon: 'wallet', bg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', title: 'Payment Received', desc: 'From Emma ($1,200)', time: 'Just now' },
                                { icon: 'users', bg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', title: 'New User', desc: 'james@example.com', time: '2h ago' },
                                { icon: 'shield', bg: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400', title: 'Security Alert', desc: 'Failed login attempt', time: '5h ago' },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 items-start group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 ${item.bg}`}>
                                        <Icon name={item.icon} size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransactionsPage = () => {
    const transactions = [
        { id: 'TRX-9021', user: 'Emma Thompson', amount: '$1,200.00', status: 'Completed', date: 'Oct 24, 2023' },
        { id: 'TRX-9022', user: 'James Wilson', amount: '$450.00', status: 'Pending', date: 'Oct 24, 2023' },
        { id: 'TRX-9023', user: 'Sarah Connor', amount: '$3,490.00', status: 'Completed', date: 'Oct 23, 2023' },
        { id: 'TRX-9024', user: 'Michael Chang', amount: '$85.00', status: 'Failed', date: 'Oct 23, 2023' },
    ];
    return (
        <div className="space-y-6 animate-slide-up pb-8">
            <div className="flex justify-between items-end">
                <div><h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Transactions</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your funds.</p></div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                            <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">{trx.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">{trx.user}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{trx.date}</td>
                                    <td className="px-6 py-4 text-sm font-extrabold text-slate-800 dark:text-white">{trx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${trx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : ''} ${trx.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : ''} ${trx.status === 'Failed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : ''}`}>{trx.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CustomersPage = () => {
    const customers = Array(8).fill(null).map((_, i) => ({ id: i, name: `Customer Name ${i+1}`, role: ['CEO', 'Developer', 'Designer', 'Manager'][i % 4] }));
    return (
        <div className="space-y-6 animate-slide-up pb-8">
            <div><h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customers</h1></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {customers.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center text-center shadow-sm hover:border-indigo-500/50 transition-colors">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">{user.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsPage = () => (
    <div className="max-w-4xl space-y-6 animate-slide-up pb-8">
        <div><h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1></div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name</label><input type="text" defaultValue="Alexander" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500" /></div>
                <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name</label><input type="text" defaultValue="Pierce" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500" /></div>
            </div>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">Save Changes</button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Notifications</h2>
            <ToggleSwitch label="Email Alerts" description="Receive daily summary emails." defaultChecked={true} />
            <ToggleSwitch label="Push Notifications" description="Get notified instantly on your device." defaultChecked={false} />
        </div>
    </div>
);

// --- Main App ---
const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    const NavItem = ({ id, iconName, label }) => {
        const active = currentPage === id;
        return (
            <li>
                <button onClick={() => { setCurrentPage(id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all group ${active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
                    <span className={active ? '' : 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}><Icon name={iconName} size={20} /></span>
                    <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{label}</span>
                </button>
            </li>
        );
    };

    const renderContent = () => {
        switch(currentPage) {
            case 'transactions': return <TransactionsPage />;
            case 'customers': return <CustomersPage />;
            case 'settings': return <SettingsPage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="flex h-screen font-sans text-slate-800 dark:text-slate-200 overflow-hidden">
            {isLoading ? (
                <><div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:block z-50"></div><SkeletonLoader /></>
            ) : (
                <>
                    {isMobileMenuOpen && <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
                    <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'} ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
                        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Icon name="zap" size={20} className="text-white" /></div>
                                <span className={`font-bold text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>Nexus<span className="text-indigo-600 dark:text-indigo-400">Pro</span></span>
                            </div>
                            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:flex text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 p-1.5 rounded-lg"><Icon name={isSidebarCollapsed ? "chevron-right" : "chevron-left"} size={18} /></button>
                            <button className="lg:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}><Icon name="x" size={24} /></button>
                        </div>
                        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar px-4 space-y-8">
                            <div>
                                <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 ${isSidebarCollapsed ? 'lg:opacity-0 lg:h-0 mb-0' : ''}`}>Menu</p>
                                <ul className="space-y-1.5">
                                    <NavItem id="dashboard" iconName="layout-dashboard" label="Dashboard" />
                                    <NavItem id="transactions" iconName="wallet" label="Transactions" />
                                    <NavItem id="customers" iconName="users" label="Customers" />
                                    <NavItem id="settings" iconName="settings" label="Settings" />
                                </ul>
                            </div>
                        </nav>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 font-medium"><Icon name="log-out" size={20} className="shrink-0" /><span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Logout Account</span></button>
                        </div>
                    </aside>

                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
                            <div className="flex items-center gap-5">
                                <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}><Icon name="menu" size={24} /></button>
                                <div className="hidden md:flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl px-4 py-2.5 w-80 border border-transparent focus-within:border-indigo-300 dark:focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                                    <Icon name="search" size={18} className="text-slate-400 shrink-0" />
                                    <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none ml-3 text-sm w-full placeholder-slate-400 text-slate-700 dark:text-slate-200" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6">
                                
                                <AnimatedThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />

                                <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden sm:block">
                                    <Icon name="bell" size={20} />
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                </button>
                                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminProf" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-md group-hover:border-indigo-100 dark:group-hover:border-slate-600 transition-colors" />
                                    <div className="hidden md:block"><p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">Alexander</p><p className="text-xs text-slate-400 font-medium">Super Admin</p></div>
                                </div>
                            </div>
                        </header>
                        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                            <div className="max-w-[1600px] mx-auto">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);



