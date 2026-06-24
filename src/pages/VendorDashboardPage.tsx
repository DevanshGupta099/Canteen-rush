import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, CheckCircle, Clock, XCircle, List, Plus, Ban, DollarSign, Settings, BarChart3, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics' | 'settings'>('orders');
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);
  
  // Store Actions
  const { canteens, pastOrders, updateDishStatus, updateDishPrice, addDish, updateOrderStatus, updateCanteenStatus } = useStore();
  
  // Local UI State
  const [selectedCanteenId, setSelectedCanteenId] = useState<string>(canteens[0]?.id || '');
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ price: '', originalPrice: '' });
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDish, setNewDish] = useState<{ name: string; description: string; price: string; type: 'veg' | 'non-veg'; category: string; image: string; prepTime: number }>({ name: '', description: '', price: '', type: 'veg', category: 'Meals', image: '/images/rich_curry.png', prepTime: 5 });

  const selectedCanteen = canteens.find(c => c.id === selectedCanteenId);

  // Computed Stats
  const activeOrders = pastOrders.filter(o => o.status === 'preparing' || o.status === 'ready');
  const completedOrders = pastOrders.filter(o => o.status === 'delivered');
  const totalSales = completedOrders.reduce((sum, o) => sum + o.amount, 0);

  const handleStatusChange = (id: string, status: 'delivered' | 'preparing' | 'ready' | 'cancelled') => {
    updateOrderStatus(id, status);
    toast.success(`Order ${id} marked as ${status}`);
  };

  const savePriceEdit = (canteenId: string, itemId: string) => {
    updateDishPrice(canteenId, itemId, Number(editForm.price), editForm.originalPrice ? Number(editForm.originalPrice) : undefined);
    toast.success(`Price updated successfully`);
    setEditingDish(null);
  };

  const handleAddDish = () => {
    if (!newDish.name || !newDish.price) {
      toast.error('Name and Price are required');
      return;
    }
    addDish(selectedCanteenId, { ...newDish, price: Number(newDish.price) });
    toast.success(`Dish added!`);
    setIsAddingDish(false);
    setNewDish({ name: '', description: '', price: '', type: 'veg', category: 'Meals', image: '/images/rich_curry.png', prepTime: 5 });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

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

      {/* Canteen Selector (Global) */}
      <div className={`mb-4 p-3 rounded-2xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <Store size={20} className="text-amber-500 ml-1" />
        <select 
          aria-label="Select Canteen"
          title="Select Canteen"
          value={selectedCanteenId} 
          onChange={e => setSelectedCanteenId(e.target.value)}
          className={`flex-1 font-black text-sm outline-none bg-transparent ${darkMode ? 'text-white' : 'text-slate-800'}`}
        >
          {canteens.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {selectedCanteen && (
          <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${selectedCanteen.isOpen ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {selectedCanteen.isOpen ? 'Open' : 'Closed'}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex overflow-x-auto no-scrollbar gap-2 mb-6 p-1.5 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-200/50'}`}>
        {[
          { id: 'orders', label: 'Orders', icon: Clock },
          { id: 'menu', label: 'Menu', icon: List },
          { id: 'analytics', label: 'Stats', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button 
            key={tab.id}
            title={tab.label}
            onClick={() => setActiveTab(tab.id as 'orders' | 'menu' | 'analytics' | 'settings')}
            className={`px-4 py-3 shrink-0 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === tab.id ? (darkMode ? 'bg-slate-800 text-amber-500 shadow' : 'bg-white text-amber-500 shadow-sm') : 'text-slate-500'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              Live Queue
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar pb-10">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <div key={order.id} className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-3 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-base">{order.id}</h3>
                      <p className={`text-xs font-bold mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{order.date} • {order.items} Items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">₹{order.amount}</p>
                      <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block ${
                        order.status === 'preparing' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs py-2.5 rounded-xl flex justify-center items-center gap-1 shadow-md transition"
                      >
                        <CheckCircle size={14} /> Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black text-xs py-2.5 rounded-xl flex justify-center items-center gap-1 shadow-md transition"
                      >
                        <CheckCircle size={14} /> Handed Over
                      </button>
                    )}
                    <button 
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition"
                      title="Cancel Order"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 font-bold text-slate-400">No active orders right now.</div>
            )}
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <div className="flex flex-col flex-1 pb-10">
          <div className="flex justify-end items-center mb-4">
            <button 
              onClick={() => setIsAddingDish(!isAddingDish)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-3 rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus size={16} strokeWidth={3} /> Add Dish
            </button>
          </div>

          {/* New Dish Form */}
          {isAddingDish && (
            <div className={`p-5 rounded-2xl border mb-6 flex flex-col gap-3 animate-fade-in ${darkMode ? 'bg-slate-900 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
              <h3 className="font-black text-amber-500">Create New Dish</h3>
              <input type="text" placeholder="Dish Name" title="Dish Name" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} className={`w-full p-3 rounded-xl text-xs font-bold border outline-none ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} />
              <input type="text" placeholder="Short Description" title="Short Description" value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} className={`w-full p-3 rounded-xl text-xs font-bold border outline-none ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} />
              <div className="flex gap-3">
                <input type="number" placeholder="Price (₹)" title="Price (₹)" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} className={`w-1/2 p-3 rounded-xl text-xs font-bold border outline-none ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} />
                <select aria-label="Select Diet Type" title="Select Diet Type" value={newDish.type} onChange={e => setNewDish({...newDish, type: e.target.value as 'veg' | 'non-veg'})} className={`w-1/2 p-3 rounded-xl text-xs font-bold border outline-none ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button onClick={() => setIsAddingDish(false)} className="px-4 py-2 text-slate-500 font-bold text-xs hover:text-slate-700">Cancel</button>
                <button onClick={handleAddDish} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl font-black text-xs shadow-md">Save Dish</button>
              </div>
            </div>
          )}

          {/* Menu Items List */}
          <div className="flex flex-col gap-3">
            {selectedCanteen?.menu.map(item => (
              <div key={item.id} className={`p-4 rounded-2xl border flex flex-col gap-3 transition-opacity ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} ${item.isSoldOut ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h4 className="font-black text-base flex flex-wrap items-center gap-2 leading-tight">
                      {item.name} 
                      {item.isSoldOut && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-widest shadow-sm">Sold Out</span>}
                    </h4>
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    {item.originalPrice && <span className={`text-[10px] line-through font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>₹{item.originalPrice}</span>}
                    <span className="font-black text-amber-500 text-lg">₹{item.price}</span>
                  </div>
                </div>

                {editingDish === item.id ? (
                  <div className={`flex flex-col gap-2 p-3 rounded-xl mt-2 border animate-fade-in ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">New Price</label>
                        <input type="number" placeholder="Price" title="New Price" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className={`w-full p-2.5 rounded-lg text-xs font-bold border outline-none focus:border-amber-500 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Original (Strikethrough)</label>
                        <input type="number" placeholder="Original" title="Original Price" value={editForm.originalPrice} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} className={`w-full p-2.5 rounded-lg text-xs font-bold border outline-none focus:border-amber-500 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`} />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                      <button onClick={() => setEditingDish(null)} className="text-slate-500 font-bold text-xs px-3 py-2">Cancel</button>
                      <button onClick={() => savePriceEdit(selectedCanteen.id, item.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-black text-xs shadow-sm transition">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className={`flex gap-2 mt-1 border-t pt-3 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button 
                      onClick={() => {
                        updateDishStatus(selectedCanteen.id, item.id, !item.isSoldOut);
                        toast.success(`${item.name} marked as ${!item.isSoldOut ? 'Sold Out' : 'Available'}`);
                      }}
                      className={`flex-1 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider flex justify-center items-center gap-1.5 transition ${item.isSoldOut ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500 hover:bg-red-500/10 hover:text-red-500'}`}
                    >
                      {item.isSoldOut ? <><CheckCircle size={14} /> Available</> : <><Ban size={14} /> Sold Out</>}
                    </button>
                    <button 
                      onClick={() => { setEditingDish(item.id); setEditForm({ price: item.price.toString(), originalPrice: item.originalPrice?.toString() || '' }); }}
                      className={`flex-1 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider flex justify-center items-center gap-1.5 transition ${darkMode ? 'bg-slate-800 text-blue-400 hover:bg-blue-500/20' : 'bg-slate-200/50 text-blue-600 hover:bg-blue-500/10'}`}
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

      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-5 animate-fade-in pb-10">
          <h2 className="text-lg font-black tracking-tight mb-2">Today's Performance</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Revenue</p>
              <p className="text-3xl font-black text-green-500">₹{totalSales}</p>
            </div>
            <div className={`p-5 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Orders</p>
              <p className="text-3xl font-black text-amber-500">{completedOrders.length}</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm mt-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className="font-black text-sm mb-4">Revenue Trend (Hourly)</h3>
            <div className="h-32 flex items-end justify-between gap-2">
              {/* Mock Bar Chart */}
              {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                <div key={i} className="flex-1 bg-amber-500/20 rounded-t-lg relative group hover:bg-amber-500/40 transition-colors" style={{ height: `${height}%` }}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{height * 10}</div>
                  <div className="absolute top-full mt-2 text-[9px] font-bold text-slate-400 left-1/2 -translate-x-1/2">{9 + i}AM</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && selectedCanteen && (
        <div className="flex flex-col gap-4 animate-fade-in pb-10">
          <h2 className="text-lg font-black tracking-tight mb-2">Canteen Settings</h2>
          
          <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div>
              <h3 className="font-black text-sm">Accepting Orders</h3>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Toggle whether your canteen is currently open to take new orders.</p>
            </div>
            <button 
              onClick={() => {
                updateCanteenStatus(selectedCanteen.id, !selectedCanteen.isOpen);
                toast.success(`Canteen marked as ${!selectedCanteen.isOpen ? 'Open' : 'Closed'}`);
              }}
              className={`w-14 h-8 rounded-full relative transition-colors ${selectedCanteen.isOpen ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${selectedCanteen.isOpen ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className={`p-5 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className="font-black text-sm mb-3">Wait Time Estimate</h3>
            <div className="flex gap-2">
              <input type="text" value={selectedCanteen.waitTime} readOnly className={`flex-1 p-3 rounded-xl text-sm font-bold border outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`} />
              <button disabled className="bg-slate-200 dark:bg-slate-800 text-slate-400 font-black px-4 rounded-xl text-xs">Update</button>
            </div>
            <p className={`text-[10px] mt-2 font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Wait time updating will be added in v2.0.</p>
          </div>
        </div>
      )}
    </div>
  );
}
