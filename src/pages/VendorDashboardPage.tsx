import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, CheckCircle, Clock, XCircle, RefreshCw, List, Plus, Ban, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import type { Canteen, MenuItem } from '../store/useStore';

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, recentOrders: [] as { id: string, amount: number, status: string, date: string }[] });
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteenId, setSelectedCanteenId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);

  // For editing dish
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ price: '', originalPrice: '' });

  // For adding new dish
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', description: '', price: '', type: 'veg', category: 'Meals', image: '/images/rich_curry.png' });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (activeTab === 'orders') setIsLoading(false);
    }
  };

  const fetchCanteens = async () => {
    try {
      const res = await fetch('/api/canteens');
      if (res.ok) {
        const data = await res.json();
        setCanteens(data);
        if (data.length > 0 && !selectedCanteenId) setSelectedCanteenId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    // eslint-disable-next-line
    fetchStats();
    // eslint-disable-next-line
    fetchCanteens();
    const interval = setInterval(() => {
      if (activeTab === 'orders') fetchStats();
    }, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, [navigate, activeTab]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Order ${id} marked as ${status}`);
        fetchStats();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleSoldOut = async (canteenId: string, item: MenuItem) => {
    try {
      const res = await fetch(`/api/admin/canteens/${canteenId}/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSoldOut: !item.isSoldOut })
      });
      if (res.ok) {
        toast.success(`${item.name} marked as ${!item.isSoldOut ? 'Sold Out' : 'Available'}`);
        fetchCanteens();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const savePriceEdit = async (canteenId: string, itemId: string) => {
    try {
      const payload: { price: number; originalPrice?: number | null } = { price: Number(editForm.price) };
      if (editForm.originalPrice) payload.originalPrice = Number(editForm.originalPrice);
      else payload.originalPrice = null; // remove discount
      
      const res = await fetch(`/api/admin/canteens/${canteenId}/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(`Price updated successfully`);
        setEditingDish(null);
        fetchCanteens();
      }
    } catch {
      toast.error('Failed to update price');
    }
  };

  const addNewDish = async () => {
    if (!newDish.name || !newDish.price) {
      toast.error('Name and Price are required');
      return;
    }
    try {
      const res = await fetch(`/api/admin/canteens/${selectedCanteenId}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDish,
          price: Number(newDish.price),
          prepTime: 5 // default
        })
      });
      if (res.ok) {
        toast.success(`Dish added!`);
        setIsAddingDish(false);
        setNewDish({ name: '', description: '', price: '', type: 'veg', category: 'Meals', image: '/images/rich_curry.png' });
        fetchCanteens();
      }
    } catch {
      toast.error('Failed to add dish');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Dashboard...</div>;
  }

  const selectedCanteen = canteens.find(c => c.id === selectedCanteenId);

  return (
    <div className={`min-h-screen flex flex-col p-6 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">Vendor Portal</h1>
            <p className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Live Management</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 mb-6 p-1.5 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-200/50'}`}>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'orders' ? (darkMode ? 'bg-slate-800 text-amber-500 shadow' : 'bg-white text-amber-500 shadow-sm') : 'text-slate-500'}`}
        >
          <Clock size={16} /> Live Orders
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'menu' ? (darkMode ? 'bg-slate-800 text-amber-500 shadow' : 'bg-white text-amber-500 shadow-sm') : 'text-slate-500'}`}
        >
          <List size={16} /> Menu Mgt
        </button>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`p-5 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Sales</p>
              <p className="text-3xl font-black text-green-500">₹{stats.totalSales}</p>
            </div>
            <div className={`p-5 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Orders</p>
              <p className="text-3xl font-black text-amber-500">{stats.totalOrders}</p>
            </div>
          </div>

          {/* Live Orders Tracker */}
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              Incoming Orders
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </h2>
            <button onClick={fetchStats} className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <RefreshCw size={12} /> Sync
            </button>
          </div>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar pb-10">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map(order => (
                <div key={order.id} className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-3 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-base">{order.id}</h3>
                      <p className={`text-xs font-bold mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">₹{order.amount}</p>
                      <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                        order.status === 'preparing' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex gap-2 mt-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                      {order.status === 'accepted' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-black text-xs py-2 rounded-xl flex justify-center items-center gap-1 transition"
                        >
                          <Clock size={14} /> Start Prep
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-black text-xs py-2 rounded-xl flex justify-center items-center gap-1 transition"
                        >
                          <CheckCircle size={14} /> Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black text-xs py-2 rounded-xl flex justify-center items-center gap-1 shadow-md transition"
                        >
                          <CheckCircle size={14} /> Mark Delivered
                        </button>
                      )}
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition"
                        title="Cancel Order"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 font-bold text-slate-400">No active orders right now.</div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-1 pb-10">
          <div className="flex justify-between items-center mb-4">
            <select 
              aria-label="Select Canteen"
              title="Select Canteen"
              value={selectedCanteenId} 
              onChange={e => setSelectedCanteenId(e.target.value)}
              className={`p-3 rounded-xl border font-bold text-sm outline-none flex-1 mr-3 ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
            >
              {canteens.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button 
              onClick={() => setIsAddingDish(!isAddingDish)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Plus size={16} /> Add Dish
            </button>
          </div>

          {/* New Dish Form */}
          {isAddingDish && (
            <div className={`p-5 rounded-2xl border mb-6 flex flex-col gap-3 animate-fade-in ${darkMode ? 'bg-slate-900 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
              <h3 className="font-black text-amber-500">Create New Dish</h3>
              <input type="text" placeholder="Dish Name" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} className={`w-full p-3 rounded-xl text-xs font-bold border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} />
              <input type="text" placeholder="Short Description" value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} className={`w-full p-3 rounded-xl text-xs font-bold border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} />
              <div className="flex gap-3">
                <input type="number" placeholder="Price (₹)" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} className={`w-1/2 p-3 rounded-xl text-xs font-bold border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} />
                <select aria-label="Select Diet Type" title="Select Diet Type" value={newDish.type} onChange={e => setNewDish({...newDish, type: e.target.value})} className={`w-1/2 p-3 rounded-xl text-xs font-bold border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button onClick={() => setIsAddingDish(false)} className="px-4 py-2 text-slate-500 font-bold text-xs">Cancel</button>
                <button onClick={addNewDish} className="bg-amber-500 text-white px-5 py-2 rounded-xl font-black text-xs">Save Dish</button>
              </div>
            </div>
          )}

          {/* Menu Items List */}
          <div className="flex flex-col gap-3">
            {selectedCanteen?.menu.map(item => (
              <div key={item.id} className={`p-4 rounded-2xl border flex flex-col gap-3 transition-opacity ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} ${item.isSoldOut ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-base flex items-center gap-2">
                      {item.name} 
                      {item.isSoldOut && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-md font-bold tracking-wider">SOLD OUT</span>}
                    </h4>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    {item.originalPrice && <span className={`text-xs line-through ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>₹{item.originalPrice}</span>}
                    <span className="font-black text-amber-500 text-lg">₹{item.price}</span>
                  </div>
                </div>

                {editingDish === item.id ? (
                  <div className={`flex flex-col gap-2 p-3 rounded-xl mt-2 border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">New Price</label>
                        <input type="number" placeholder="Price" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className={`w-full p-2 rounded-lg text-xs font-bold border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Original Price (Strikethrough)</label>
                        <input type="number" placeholder="Original" value={editForm.originalPrice} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} className={`w-full p-2 rounded-lg text-xs font-bold border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                      <button onClick={() => setEditingDish(null)} className="text-slate-500 font-bold text-xs px-3 py-2">Cancel</button>
                      <button onClick={() => savePriceEdit(selectedCanteen.id, item.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-black text-xs transition">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className={`flex gap-2 mt-1 border-t pt-3 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button 
                      onClick={() => toggleSoldOut(selectedCanteen.id, item)}
                      className={`flex-1 py-2 rounded-xl font-black text-xs flex justify-center items-center gap-1.5 transition ${item.isSoldOut ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500 hover:bg-red-500/10 hover:text-red-500'}`}
                    >
                      {item.isSoldOut ? <><CheckCircle size={14} /> Available</> : <><Ban size={14} /> Sold Out</>}
                    </button>
                    <button 
                      onClick={() => { setEditingDish(item.id); setEditForm({ price: item.price.toString(), originalPrice: item.originalPrice?.toString() || '' }); }}
                      className={`flex-1 py-2 rounded-xl font-black text-xs flex justify-center items-center gap-1.5 transition ${darkMode ? 'bg-slate-800 text-blue-400 hover:bg-blue-500/20' : 'bg-slate-200/50 text-blue-600 hover:bg-blue-500/10'}`}
                    >
                      <DollarSign size={14} /> Edit Price
                    </button>
                  </div>
                )}
              </div>
            ))}
            {(!selectedCanteen?.menu || selectedCanteen.menu.length === 0) && (
              <div className="text-center py-10 font-bold text-slate-400">No dishes available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
