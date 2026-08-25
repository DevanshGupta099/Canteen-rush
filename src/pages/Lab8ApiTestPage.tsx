import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { ArrowLeft, Search, Plus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
}

export default function Lab8ApiTestPage() {
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);
  
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [canteens, setCanteens] = useState<{ _id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || localStorage.getItem('canteen_rush_token') || '');
  
  // New Product Form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Meals',
    type: 'veg',
    description: 'Fresh and delicious preparation',
    canteenId: ''
  });

  // Ensure Admin Token
  const getValidToken = async (): Promise<string> => {
    if (token) return token;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'vendor@canteenrush.com', password: 'admin' })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('canteen_rush_token', data.token);
        return data.token;
      }
    } catch (e) {
      console.error('Auto login error:', e);
    }
    return '';
  };

  // Fetch Canteens for valid Canteen ID
  useEffect(() => {
    fetch('/api/canteens')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCanteens(data);
          setNewProduct(prev => ({ ...prev, canteenId: data[0]._id }));
        }
      })
      .catch(err => console.error('Failed to load canteens:', err));
  }, []);

  // 1. READ & FILTER
  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('q', searchQuery);
      if (category !== 'All') queryParams.append('category', category);
      
      const res = await fetch(`/api/products/explore?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, category]);

  // 2. CREATE
  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.price) return toast.error('Name and price required');
    const authToken = await getValidToken();
    try {
      const selectedCanteenId = newProduct.canteenId || (canteens.length > 0 ? canteens[0]._id : '6a643d5b417d1f3f302cfe5f');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ ...newProduct, canteenId: selectedCanteenId, price: Number(newProduct.price) })
      });
      if (res.ok) {
        toast.success('Product created securely!');
        fetchProducts(); 
        setNewProduct({ ...newProduct, name: '', price: '', description: '' });
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Error creating product');
      }
    } catch {
      toast.error('Error creating product');
    }
  };

  // 3. UPDATE
  const handleUpdate = async (id: string, currentPrice: number) => {
    const newPrice = prompt('Enter new price (₹):', currentPrice.toString());
    if (!newPrice) return;
    const authToken = await getValidToken();
    
    try {
      const res = await fetch(`/api/products/${id}/price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ price: Number(newPrice) })
      });
      if (res.ok) {
        toast.success('Product updated!');
        fetchProducts();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Error updating product');
      }
    } catch {
      toast.error('Error updating product');
    }
  };

  // 4. DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const authToken = await getValidToken();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        toast.success('Product deleted securely!');
        fetchProducts();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Error deleting product');
      }
    } catch {
      toast.error('Error deleting product');
    }
  };

  return (
    <div className={`min-h-screen p-6 pb-28 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <div className="flex items-center gap-3 mb-6 mt-4">
        <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white shadow-sm text-slate-700 hover:bg-slate-100'}`}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black">Lab 8 API Test</h1>
          <p className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>REST CRUD Operations</p>
        </div>
      </div>

      <div className={`p-5 rounded-3xl border mb-6 shadow-sm animate-slide-up ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h2 className="font-black mb-1 text-sm">1. CREATE</h2>
        <p className={`text-xs font-bold mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>POST /api/products</p>
        
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={`p-3.5 rounded-2xl border outline-none text-sm font-bold transition-all focus:border-christ ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
          <div className="flex gap-2">
            <input type="number" placeholder="Price (₹)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className={`flex-1 p-3.5 rounded-2xl border outline-none text-sm font-bold transition-all focus:border-christ ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className={`flex-1 p-3.5 rounded-2xl border outline-none text-sm font-bold transition-all focus:border-christ ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <option value="Meals">Meals</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>
          <button onClick={handleCreate} className="bg-christ text-white p-3.5 rounded-2xl font-black text-sm flex justify-center items-center gap-2 shadow-lg shadow-christ/20 active:scale-95 transition-transform mt-1">
            <Plus size={18} strokeWidth={3} /> Create Product
          </button>
        </div>
      </div>

      <div className={`p-5 rounded-3xl border shadow-sm animate-slide-up animation-delay-100 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h2 className="font-black mb-1 text-sm">2. READ & FILTER</h2>
        <p className={`text-xs font-bold mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>GET /api/products/explore</p>
        
        <div className="flex gap-2 mb-4">
          <div className={`flex-1 flex items-center gap-2 p-3.5 rounded-2xl border transition-all focus-within:border-christ ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search by name (Query Param)..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`bg-transparent border-none outline-none text-sm font-bold w-full ${darkMode ? 'text-white' : 'text-slate-800'}`} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className={`w-[120px] p-3.5 rounded-2xl border outline-none text-sm font-bold transition-all focus:border-christ ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <option value="All">All Categories</option>
            <option value="Meals">Meals</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          {products.length > 0 ? products.map(product => (
            <div key={product._id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all hover:shadow-md ${darkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
              <div>
                <h4 className="font-black text-sm">{product.name}</h4>
                <p className={`text-xs font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{product.category} • ₹{product.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleUpdate(product._id, product.price)} className={`p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`} title="PATCH /api/products/:id/price">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(product._id)} className={`p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`} title="DELETE /api/products/:id">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className={`text-center font-bold text-sm py-8 rounded-2xl border border-dashed ${darkMode ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-200'}`}>
              No products found matching filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
