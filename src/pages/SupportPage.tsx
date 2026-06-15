import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, HelpCircle, Phone, ChevronRight, Search, Send, Ticket, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: 'submitted' | 'processing' | 'resolved';
  date: string;
  messages: { sender: 'user' | 'agent'; text: string; time: string }[];
}

export default function SupportPage() {
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState<'main' | 'order-help' | 'payments-help' | 'passes-help' | 'volunteer-help' | 'chat'>('main');
  
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order Issues');

  // Poll support tickets from backend
  useEffect(() => {
    const fetchTickets = () => {
      fetch('/api/support/tickets')
        .then(res => res.json())
        .then(data => {
          setTickets(prev => {
            // Compare statuses to trigger joins and resolutions
            data.forEach((newTk: SupportTicket) => {
              const oldTk = prev.find(t => t.id === newTk.id);
              if (oldTk && oldTk.status !== newTk.status) {
                if (newTk.status === 'processing') {
                  toast('Support representative Arjun has joined!', { icon: '💬' });
                } else if (newTk.status === 'resolved') {
                  toast.success('Support Ticket Resolved!', {
                    icon: '🧑‍💼',
                    duration: 3000
                  });
                }
              }
            });
            return data;
          });
        })
        .catch(err => console.error(err));
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);

    // Public Visible API 2: Quotes
    fetch('https://dummyjson.com/quotes/random')
      .then(res => res.json())
      .then(data => {
        setQuote({ text: data.quote, author: data.author });
      })
      .catch(() => console.error('Failed to fetch quote'));

    return () => clearInterval(interval);
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error('Please fill in all ticket fields.');
      return;
    }

    fetch('/api/support/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: ticketCategory,
        subject: ticketSubject,
        message: ticketMessage
      })
    })
      .then(res => res.json())
      .then(newTicket => {
        setTickets(prev => [newTicket, ...prev]);
        setTicketSubject('');
        setTicketMessage('');
        toast.success('Support Ticket Submitted!', {
          icon: '🎫',
          style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
        });
      })
      .catch(() => {
        toast.error('Failed to submit ticket.');
      });
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTicketId) return;

    fetch(`/api/support/tickets/${selectedTicketId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: chatInput
      })
    })
      .then(res => res.json())
      .then(updatedTicket => {
        setTickets(prev => prev.map(t => t.id === selectedTicketId ? updatedTicket : t));
        setChatInput('');
      })
      .catch(() => {
        toast.error('Failed to send message.');
      });
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const mainFAQs = [
    { q: 'How do I cancel my meal?', a: 'Cancel within 2 minutes of booking via the order Tracker page to receive a 100% refund.' },
    { q: 'How does the auto top-up threshold work?', a: 'If enabled in Settings, ₹500 is added instantly from your saved card when wallet balance falls below ₹100 during checkout.' },
    { q: 'What is Dorm-Drop Delivery?', a: 'A peer-to-peer campus service where student volunteers deliver fresh food to university hostel rooms for a small ₹10 fee.' },
    { q: 'How do I redeem my streak Rush Coins?', a: 'Click the Coins widget in your Profile Page to open the rewards drawer, select a snack, and scan the voucher at the canteens.' }
  ];

  const filteredFAQs = searchQuery
    ? mainFAQs.filter(faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : mainFAQs;

  return (
    <div className={`h-full w-full flex flex-col transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Dynamic Header cover */}
      <div className={`px-5 pt-8 pb-4 flex items-center gap-4 sticky top-0 z-20 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-b border-slate-850' : 'bg-white border-b border-slate-100 shadow-sm'
      }`}>
        <button 
          onClick={() => {
            if (activePage !== 'main') {
              setActivePage('main');
              setSelectedTicketId(null);
            } else {
              navigate(-1);
            }
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-750' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          aria-label="Back button"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-black text-lg leading-tight">
            {activePage === 'main' && 'Help & Support'}
            {activePage === 'order-help' && 'Order Resolution'}
            {activePage === 'payments-help' && 'Billing & Wallet'}
            {activePage === 'passes-help' && 'Cafeteria Pass Terms'}
            {activePage === 'volunteer-help' && 'Campus Volunteering'}
            {activePage === 'chat' && `Ticket ${selectedTicketId}`}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            {activePage === 'main' && 'Christ Canteen Support Centre'}
            {activePage !== 'main' && 'Help Guidelines & Live Tickets'}
          </p>
        </div>
      </div>

      {/* Main Support Center Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-20 no-scrollbar">
        
        {/* SUB PAGE: MAIN HELP CENTER */}
        {activePage === 'main' && (
          <div className="space-y-6">
            
            {/* Dynamic Quote Banner */}
            {quote && (
              <div className={`p-4 rounded-2xl border text-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className="text-xs italic text-slate-500">"{quote.text}"</p>
                <p className="text-[10px] font-bold mt-1 text-amber-500">- {quote.author}</p>
              </div>
            )}

            {/* Quick Contact Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  toast.success('Live Helpdesk connected!');
                  setActivePage('chat');
                  // Trigger mock chat with latest ticket
                  setSelectedTicketId(tickets[0].id);
                }} 
                className="bg-christ text-white p-5 rounded-3.5xl shadow-lg flex flex-col items-center gap-2 text-center active:scale-95 transition-transform border border-christ/20 relative"
              >
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                <MessageCircle size={26} className="text-amber-450 animate-pulse" />
                <div>
                  <span className="font-black text-xs block">Live Helpdesk</span>
                  <span className="text-[9px] text-slate-300 font-bold">Simulate chat support</span>
                </div>
              </button>
              
              <a 
                href="tel:+919876543210"
                className={`p-5 rounded-3.5xl border flex flex-col items-center gap-2 text-center active:scale-95 transition-transform ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <Phone size={26} className="text-amber-500 animate-bounce" />
                <div>
                  <span className="font-black text-xs block dark:text-white text-slate-800">Call Support</span>
                  <span className="text-[9px] text-slate-400 font-bold">Christ Canteen Helpline</span>
                </div>
              </a>
            </div>

            {/* Nested Content Categories */}
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3 px-1">Guidelines Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: 'order-help', label: '🛍️ Order Issues', desc: 'Missing items, long queues' },
                  { id: 'payments-help', label: '💸 Wallet & Cash', desc: 'Fails, double charges' },
                  { id: 'passes-help', label: '🎫 Student Passes', desc: 'Auto renewals, limits' },
                  { id: 'volunteer-help', label: '🙋 Volunteering', desc: 'Dorm-Drop & Coins' }
                ] as const).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActivePage(cat.id)}
                    className={`p-4 rounded-3xl border text-left active:scale-[0.98] transition-all flex flex-col justify-between h-24 ${
                      darkMode ? 'bg-slate-900 border-slate-850 hover:border-slate-800' : 'bg-white border-slate-150 shadow-sm hover:border-slate-200'
                    }`}
                  >
                    <span className="font-black text-xs block leading-tight">{cat.label}</span>
                    <span className="text-[9px] text-slate-500 leading-tight block mt-1">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Search Engine */}
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3 px-1">Browse FAQs</h3>
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="Search help, orders, coins, refunds..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-3.5 pl-10 pr-4 rounded-2xl text-xs outline-none border transition-all ${
                    darkMode 
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-white border-slate-200 text-slate-800 focus:border-christ'
                  }`}
                />
                <Search className="absolute left-3.5 top-4 text-slate-400" size={15} />
              </div>

              <div className={`rounded-3xl border overflow-hidden ${
                darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'
              }`}>
                {filteredFAQs.map((faq, i) => (
                  <div key={i} className={`p-4 border-b last:border-0 ${darkMode ? 'border-slate-850' : 'border-slate-50'}`}>
                    <h4 className="font-black text-xs flex items-start gap-1.5 leading-snug">
                      <HelpCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1.5 pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
                {filteredFAQs.length === 0 && (
                  <p className="p-5 text-center text-xs text-slate-400 font-bold">No FAQs found matching "{searchQuery}"</p>
                )}
              </div>
            </div>

            {/* Ticket Submission Form */}
            <div className={`p-5 rounded-3.5xl border ${
              darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'
            }`}>
              <h3 className="font-black text-sm mb-1 flex items-center gap-1.5">
                <Ticket className="text-amber-500" size={16} /> File Support Ticket
              </h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-4">Direct resolution from outlet managers</p>
              
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Issue Category</label>
                  <select 
                    aria-label="Issue Category"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                      darkMode ? 'bg-slate-850 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-850'
                    }`}
                  >
                    <option>Order Issues</option>
                    <option>Refunds & Wallet</option>
                    <option>Meal Passes T&C</option>
                    <option>Dorm-Drop Delivery</option>
                    <option>Streaks & Coins rewards</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Issue Subject</label>
                  <input 
                    type="text" 
                    placeholder="Brief summary (e.g. Noodles cold)"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                      darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Detailed Message</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide details, order reference ID, or description of the problem..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                      darkMode ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-christ'
                    }`}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-christ dark:bg-amber-500 text-white font-black text-xs py-3.5 rounded-xl hover:bg-christ/95 dark:hover:bg-amber-600 shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="animate-pulse" /> Submit Support Ticket
                </button>
              </form>
            </div>

            {/* Active Tickets Tracker */}
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3 px-1">Your Active Support Tickets</h3>
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setActivePage('chat');
                    }}
                    className={`p-4 rounded-3xl border cursor-pointer hover:border-amber-500/30 transition-all flex justify-between items-start ${
                      darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs">{ticket.subject}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${
                          ticket.status === 'resolved' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : ticket.status === 'processing' 
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 font-bold">Ref: #{ticket.id} • {ticket.category} • {ticket.date}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 self-center" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUB PAGE: ORDER ISSUES GUIDELINES */}
        {activePage === 'order-help' && (
          <div className="space-y-5 animate-pop text-xs leading-relaxed">
            <div className={`p-5 rounded-3.5xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'}`}>
              <h3 className="font-black text-sm text-christ dark:text-amber-500 mb-3 flex items-center gap-1.5">
                🛍️ Order Cancellation Policy
              </h3>
              <p>Christ University guidelines enforce a strict **2-minute cancellation window** from transaction booking.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Go to **Orders &rarr; Live Tracking** immediately.</li>
                <li>If within 2 minutes, click **"Cancel Order"**.</li>
                <li>Your order is cancelled, food slips voided, and ₹ amount fully refunded back to your canteen student wallet instantly.</li>
              </ul>
            </div>

            <div className={`p-5 rounded-3.5xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'}`}>
              <h3 className="font-black text-sm text-christ dark:text-amber-500 mb-3 flex items-center gap-1.5">
                🍲 Missing Food or Wrong Dish
              </h3>
              <p>If you receive a dish different from your order token or have parts of your meal missing:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Present your digital gold ticket barcode to the counter manager instantly.</li>
                <li>Do not click **"Confirm Pick-Up"** on the tracking screen.</li>
                <li>The counter staff will verify, override the system, and serve you the correct item immediately, or authorize an instant manager wallet credit.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SUB PAGE: BILLING & WALLET GUIDELINES */}
        {activePage === 'payments-help' && (
          <div className="space-y-5 animate-pop text-xs leading-relaxed">
            <div className={`p-5 rounded-3.5xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'}`}>
              <h3 className="font-black text-sm text-christ dark:text-amber-500 mb-3 flex items-center gap-1.5">
                💸 UPI & Failed Payments Rollovers
              </h3>
              <p>UPI gateways can occasionally report a "failed" status while debiting bank funds. Here is the campus billing rollback roadmap:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Failed UPI top-ups will automatically trigger a reversal, returning to your source bank account within **2-4 university banking days**.</li>
                <li>If the wallet balance doesn't update, take a screenshot of the banking UPI reference transaction ID and file a **Support Ticket** below. Outlet managers will verify logs and credit manually.</li>
              </ul>
            </div>

            <div className={`p-5 rounded-3.5xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'}`}>
              <h3 className="font-black text-sm text-christ dark:text-amber-500 mb-3 flex items-center gap-1.5">
                ⚡ Auto Top-up Security Threshold
              </h3>
              <p>Enable **Auto Top-up** in settings to never get blocked during busy class breaks:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Requires at least one saved credit/debit card on file.</li>
                <li>Trigger: Automatically loads ₹500 from your primary card if balance falls below ₹100 during checkout.</li>
                <li>Fully secure, utilizing dual PCI-compliant authentication tokens. Can be toggled off instantly at any time.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SUB PAGE: PASSES TERMS */}
        {activePage === 'passes-help' && (
          <div className="space-y-5 animate-pop text-xs leading-relaxed">
            <div className={`p-5 rounded-3.5xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'}`}>
              <h3 className="font-black text-sm text-christ dark:text-amber-500 mb-3 flex items-center gap-1.5">
                🎫 Cafeteria pass Guidelines
              </h3>
              <p>Meal and coffee passes allow active students to save up to 50% and skip counter payment steps entirely:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>**Validity**: All passes hold a strict 30-day window from purchase and are non-transferable.</li>
                <li>**Redemptions limit**: Lunch passes can be scanned up to 2 times a day. Coffee passes allow up to 3 redemptions a day.</li>
                <li>**Cancellation**: Active passes cannot be cancelled or refunded post their first voucher scan.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SUB PAGE: CAMPUS VOLUNTEERING */}
        {activePage === 'volunteer-help' && (
          <div className="space-y-5 animate-pop text-xs leading-relaxed">
            <div className={`p-5 rounded-3.5xl border ${darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-150 shadow-sm'}`}>
              <h3 className="font-black text-sm text-christ dark:text-amber-500 mb-3 flex items-center gap-1.5">
                🙋 Earning Coins with Dorm-Drop Delivery
              </h3>
              <p>Help your fellow hostel mates and earn **Rush Coins** to redeem for free canteen snacks:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>**Volunteering signup**: Toggle the volunteer checkbox in your profile dashboard to declare yourself active.</li>
                <li>**Drop-off pickup**: When ordering, if a peer delivery is requested in your hostel block, you get a push ping. Pick it up from the canteen counter along with your own meal.</li>
                <li>**Earning**: Each successful Dorm-Drop delivery awards **₹10** in cash credit + **50 Rush Coins** directly to your student wallet.</li>
              </ul>
            </div>
          </div>
        )}

        {/* SUB PAGE: LIVE TICKET SUPPORT CHAT SIMULATOR */}
        {activePage === 'chat' && selectedTicket && (
          <div className="space-y-4 animate-pop flex flex-col h-full">
            
            {/* Ticket Subject Block */}
            <div className={`p-4 rounded-3xl border flex flex-col gap-1.5 ${
              darkMode ? 'bg-slate-900/80 border-slate-850' : 'bg-white border-slate-150'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-black text-xs">{selectedTicket.subject}</span>
                <span className="text-[8px] font-mono tracking-widest text-slate-450 bg-slate-950/20 px-2 py-0.5 rounded">#{selectedTicket.id}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Category: {selectedTicket.category} • Filed: {selectedTicket.date}</p>
              
              {/* Timeline Status */}
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-dashed border-slate-800">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  selectedTicket.status === 'resolved' ? 'bg-green-500' : 'bg-amber-500 animate-ping'
                }`} />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Status: {selectedTicket.status === 'resolved' ? '✅ Resolve Confirmed' : '🧑‍💼 Agent Arjun Investigating'}
                </span>
              </div>
            </div>

            {/* Chat Messages Frame */}
            <div className={`flex-1 p-4 rounded-3.5xl border min-h-[220px] max-h-[300px] overflow-y-auto space-y-3 flex flex-col no-scrollbar ${
              darkMode ? 'bg-slate-900/30 border-slate-850' : 'bg-slate-100/50 border-slate-150'
            }`}>
              {selectedTicket.messages.map((m, idx) => {
                const isUser = m.sender === 'user';
                return (
                  <div 
                    key={idx} 
                    className={`max-w-[80%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm animate-pop ${
                      isUser 
                        ? 'bg-christ text-white self-end rounded-tr-none' 
                        : (darkMode ? 'bg-slate-800 text-slate-200 self-start rounded-tl-none border border-slate-750' : 'bg-white text-slate-800 self-start rounded-tl-none border border-slate-150')
                    }`}
                  >
                    <p className="font-bold">{m.text}</p>
                    <span className="text-[7px] text-slate-400 block mt-1 text-right">{m.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Send Reply box */}
            {selectedTicket.status !== 'resolved' && (
              <form onSubmit={handleSendChatMessage} className="flex gap-2 relative z-10">
                <input 
                  type="text" 
                  placeholder="Type reply to Arjun..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs outline-none border transition-all ${
                    darkMode 
                      ? 'bg-slate-850 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-white border-slate-200 text-slate-850 focus:border-christ'
                  }`}
                />
                <button 
                  type="submit"
                  aria-label="Send message"
                  className="bg-christ dark:bg-amber-500 text-white p-3 rounded-xl hover:bg-christ/95 active:scale-95 transition-transform"
                >
                  <Send size={15} />
                </button>
              </form>
            )}

            {selectedTicket.status === 'resolved' && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3.5 rounded-2xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider animate-pop">
                <CheckCircle2 size={14} /> Ticket Closed successfully
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}