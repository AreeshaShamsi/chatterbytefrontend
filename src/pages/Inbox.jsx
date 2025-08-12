import React, { useEffect, useState } from "react";
import { 
  Mail, Inbox, Star, Send, FileText, Archive, Trash2, MoreHorizontal, 
  Search, Menu, Settings, Plus, RefreshCw, User, 
  Clock, AlertCircle, Tag, Filter, ArrowLeft, Reply, 
  ReplyAll, Forward, Printer, X, Bell
} from "lucide-react";
import Sidebar from "../components/Sidebar"; // Import your existing sidebar component

export default function InboxPage() {
  const [allEmails, setAllEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [activeTab, setActiveTab] = useState('primary');
  const [openEmail, setOpenEmail] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when screen size changes
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch emails from API
  useEffect(() => {
    async function fetchAllEmails() {
      setLoading(true);
      setError("");

      try {
        const API_BASE_URL =
          window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://talkportbackend.vercel.app";

        const res = await fetch(`${API_BASE_URL}/api/emails`, {
          method: "GET",
          credentials: "include", // ✅ sends session cookie
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setAllEmails(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError("Failed to fetch emails.");
        setAllEmails([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllEmails();
  }, []);

  const toggleEmailSelection = (accountIndex, emailIndex) => {
    const emailId = `${accountIndex}-${emailIndex}`;
    const newSelected = new Set(selectedEmails);
    
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    
    setSelectedEmails(newSelected);
  };

  const openEmailHandler = (accountIndex, emailIndex) => {
    const email = allEmails[accountIndex]?.messages[emailIndex];
    if (email) {
      setOpenEmail({
        ...email,
        accountIndex,
        emailIndex,
        accountEmail: allEmails[accountIndex].email
      });
    }
  };

  const closeEmail = () => {
    setOpenEmail(null);
  };

  const toggleSelectAll = () => {
    if (selectedEmails.size > 0) {
      setSelectedEmails(new Set());
    } else {
      const allEmailIds = [];
      allEmails.forEach((account, accountIndex) => {
        account.messages?.forEach((_, emailIndex) => {
          allEmailIds.push(`${accountIndex}-${emailIndex}`);
        });
      });
      setSelectedEmails(new Set(allEmailIds));
    }
  };

  const totalEmails = allEmails.reduce((total, account) => {
    return total + (account.messages?.length || 0);
  }, 0);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600', 
      'from-cyan-500 to-cyan-600',
      'from-teal-500 to-teal-600',
      'from-sky-500 to-sky-600'
    ];
    const hash = name ? name.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        inset-y-0 left-0 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        <Sidebar 
          totalEmails={totalEmails}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col min-w-0
        ${!isMobile ? 'ml-0' : ''}
        transition-all duration-300 ease-in-out
      `}>
        {/* Top Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-blue-200/60 shadow-sm">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Mobile menu + Search */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Hamburger Menu (Mobile Only) */}
                {isMobile && (
                  <button 
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors shrink-0"
                  >
                    <Menu className="w-5 h-5 text-slate-600" />
                  </button>
                )}

                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search emails..."
                      className="w-full pl-10 pr-4 py-2 bg-blue-50/50 border border-blue-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-1 md:gap-2">
                <button className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105">
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 md:px-6">
            <div className="flex items-center border-b border-blue-200/60 overflow-x-auto">
              {['Primary', 'Social', 'Promotions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 md:px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                    activeTab === tab.toLowerCase()
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
                  }`}
                >
                  {tab}
                  {tab === 'Primary' && totalEmails > 0 && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                      {totalEmails}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email Toolbar */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-blue-200/60 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <input
                type="checkbox"
                checked={selectedEmails.size > 0 && selectedEmails.size === totalEmails}
                onChange={toggleSelectAll}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700 text-sm md:text-base">Select All</span>
            </div>

            {selectedEmails.size > 0 && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-blue-600">{selectedEmails.size}</span> of{" "}
                <span className="font-semibold">{totalEmails}</span> selected
              </div>
            )}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 md:px-6 py-4">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="font-semibold">Loading emails...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Error</span>
                </div>
                <p className="text-red-600 mt-2 font-medium">{error}</p>
              </div>
            )}

            {!loading && totalEmails === 0 && !error && (
              <div className="text-center py-20">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Inbox className="w-12 h-12 md:w-16 md:h-16 text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">Your Primary tab is empty</h3>
                <p className="text-slate-500 mb-8 text-base md:text-lg">Messages from people you know will appear here.</p>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 md:px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  Check other tabs
                </button>
              </div>
            )}

            {/* Email List */}
            {totalEmails > 0 && (
              <div className="space-y-1">
                {allEmails.map((account, accountIndex) => (
                  <div key={accountIndex}>
                    {/* Account Header */}
                    {allEmails.length > 1 && (
                      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-3 border-b border-blue-200/60 z-10 rounded-xl mb-2">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                          {account.email}
                        </span>
                      </div>
                    )}

                    {/* Emails */}
                    {Array.isArray(account.messages) && account.messages.length > 0 ? (
                      account.messages.map((email, emailIndex) => {
                        const emailId = `${accountIndex}-${emailIndex}`;
                        const isSelected = selectedEmails.has(emailId);
                        
                        return (
                          <div
                            key={emailIndex}
                            className={`group flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-4 border border-blue-200/60 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] mb-2 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100/80 border-blue-300 shadow-md scale-[1.01]' 
                                : 'bg-white/95 hover:bg-white hover:shadow-lg hover:border-blue-300'
                            }`}
                            onClick={(e) => {
                              if (e.target.closest('button') || e.target.closest('input[type="checkbox"]')) {
                                return;
                              }
                              openEmailHandler(accountIndex, emailIndex);
                            }}
                          >
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleEmailSelection(accountIndex, emailIndex)}
                              className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* Avatar */}
                            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${getAvatarColor(email.from)} rounded-full flex items-center justify-center shadow-md shrink-0`}>
                              <span className="text-white font-bold text-xs md:text-sm">
                                {getInitials(email.from)}
                              </span>
                            </div>

                            {/* Email Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-semibold truncate text-sm md:text-base ${!email.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                      {email.from}
                                    </span>
                                    {!email.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                                    )}
                                  </div>
                                  <p className={`font-medium truncate mb-1 text-sm md:text-base ${!email.isRead ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {email.subject}
                                  </p>
                                  <p className="text-xs md:text-sm text-slate-500 truncate">
                                    {email.snippet}
                                  </p>
                                </div>
                                
                                {/* Date and Mobile Actions */}
                                <div className="flex items-center justify-between md:flex-col md:text-right shrink-0">
                                  <div>
                                    <span className="text-xs md:text-sm text-slate-500 font-medium block">
                                      {email.date}
                                    </span>
                                    {email.time && (
                                      <span className="text-xs text-slate-400">
                                        {email.time}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Mobile Action Buttons */}
                                  <div className="flex items-center gap-1 md:hidden">
                                    <button 
                                      className="p-1 hover:bg-blue-100/80 rounded-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Star className={`w-4 h-4 ${email.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Action Buttons */}
                            <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="p-2 hover:bg-blue-100/80 rounded-xl hover:scale-110 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Star className={`w-4 h-4 ${email.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
                              </button>
                              <button className="p-2 hover:bg-blue-100/80 rounded-xl hover:scale-110 transition-all duration-200">
                                <Archive className="w-4 h-4 text-slate-500" />
                              </button>
                              <button className="p-2 hover:bg-blue-100/80 rounded-xl hover:scale-110 transition-all duration-200">
                                <Trash2 className="w-4 h-4 text-slate-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-12 text-center text-slate-500 bg-white/80 rounded-2xl border border-blue-200/60">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                        <p className="font-semibold">No emails found for this account.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {openEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden">
            {/* Email Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-blue-200/60 bg-gradient-to-r from-blue-50 to-blue-100/80">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button 
                  onClick={closeEmail}
                  className="p-2 hover:bg-blue-200/80 rounded-xl transition-all duration-200 shrink-0 hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5 text-blue-600" />
                </button>
                <h2 className="font-bold text-slate-800 truncate text-base md:text-lg">
                  {openEmail.subject || 'No Subject'}
                </h2>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <button className="p-2 hover:bg-blue-200/80 rounded-xl transition-all duration-200 hover:scale-105">
                  <Archive className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-blue-200/80 rounded-xl transition-all duration-200 hover:scale-105">
                  <Trash2 className="w-4 h-4 text-blue-600" />
                </button>
                <button className="hidden md:block p-2 hover:bg-blue-200/80 rounded-xl transition-all duration-200 hover:scale-105">
                  <Printer className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-blue-200/80 rounded-xl transition-all duration-200 hover:scale-105">
                  <MoreHorizontal className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-auto max-h-[calc(95vh-200px)] md:max-h-[calc(90vh-200px)]">
              <div className="p-4 md:p-6">
                {/* Email Info */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${getAvatarColor(openEmail.from)} rounded-full flex items-center justify-center shrink-0 shadow-md`}>
                        <span className="text-white font-bold text-xs md:text-sm">
                          {getInitials(openEmail.from)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 truncate text-base md:text-lg">{openEmail.from}</h3>
                        <p className="text-sm text-slate-500 truncate">to {openEmail.accountEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:text-right">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">{openEmail.date}</p>
                        {openEmail.time && (
                          <p className="text-xs text-slate-400">{openEmail.time}</p>
                        )}
                      </div>
                      <button className="p-1 hover:bg-blue-100/80 rounded-xl hover:scale-110 transition-all duration-200">
                        <Star className={`w-4 h-4 ${openEmail.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="prose max-w-none">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 md:p-6 rounded-2xl border border-blue-200/60 shadow-sm">
                    {openEmail.textHtml ? (
                      <div 
                        className="text-slate-700 leading-relaxed email-content text-sm md:text-base"
                        dangerouslySetInnerHTML={{ __html: openEmail.textHtml }}
                        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                      />
                    ) : (
                      <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {openEmail.body || 
                         openEmail.textPlain || 
                         openEmail.snippet || 
                         'This email has no content to display.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Attachments */}
                {openEmail.attachments && openEmail.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-800 mb-4">Attachments</h4>
                    <div className="space-y-3">
                      {openEmail.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/60 hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                          <FileText className="w-6 h-6 text-blue-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-slate-700 truncate block">{attachment.name}</span>
                            {attachment.size && (
                              <span className="text-xs text-slate-500">{attachment.size}</span>
                            )}
                          </div>
                          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0 px-3 py-1 hover:bg-blue-50 rounded-lg transition-all duration-200">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Actions */}
            <div className="border-t border-blue-200/60 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100/50">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                  <ReplyAll className="w-4 h-4" />
                  <span>Reply All</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                  <Forward className="w-4 h-4" />
                  <span>Forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}