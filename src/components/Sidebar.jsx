import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Inbox, 
  Send, 
  FileText, 
  Edit3, 
  Pin, 
  Archive, 
  Plus, 
  Mail, 
  Settings, 
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  Trash2
} from 'lucide-react';


// Import Firebase Auth (add this to your actual project)
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Sidebar = ({ totalEmails, isMobile, isOpen, onClose }) => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAccounts, setExpandedAccounts] = useState({});
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [userGmail, setUserGmail] = useState('user@gmail.com');
  const [inboxCount, setInboxCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [draftsCount, setDraftsCount] = useState(0);

  // API Configuration
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://chatterbytebackend.vercel.app';

  // Menu items with dynamic counts
  const menuItems = [
    { id: 'inbox', icon: Inbox, label: 'Inbox', count: totalEmails || inboxCount, active: true },
    { id: 'sent', icon: Send, label: 'Sent', count: sentCount },
    { id: 'drafts', icon: Edit3, label: 'Drafts', count: draftsCount },
    { id: 'notes', icon: FileText, label: 'Meeting Notes' },
    { id: 'pinned', icon: Pin, label: 'Pinned' },
    { id: 'archive', icon: Archive, label: 'Archive' },
  ];

  // Fetch connected accounts and user data from Firebase
  useEffect(() => {
    fetchUserData();
    fetchConnectedAccounts();
    fetchEmailCounts();
  }, []);

  // Fetch real Firebase user email
  const fetchUserData = () => {
    onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserGmail(user.email);
      } else {
        setUserGmail("user@gmail.com");
      }
    });
  };

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/emails`);
      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real email counts from API
  const fetchEmailCounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/counts`);
      if (response.ok) {
        const counts = await response.json();
        setInboxCount(counts.inbox || 0);
        setSentCount(counts.sent || 0);
        setDraftsCount(counts.drafts || 0);
      }
    } catch (error) {
      console.error("Error fetching email counts:", error);
      // Fallback: sum inbox lengths from all connected accounts
      const totalInbox = connectedAccounts.reduce(
        (sum, account) => sum + (account.inbox?.length || 0),
        0
      );
      setInboxCount(totalInbox);
    }
  };

  // Show remove confirmation modal
  const showRemoveConfirmation = (accountEmail) => {
    setAccountToRemove(accountEmail);
    setShowRemoveModal(true);
  };

  // Handle confirmed account removal
  const handleConfirmRemoveAccount = async () => {
    if (!accountToRemove) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/${accountToRemove}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchConnectedAccounts(); // refresh accounts
        // Close expanded state for removed account
        const accountIndex = connectedAccounts.findIndex(acc => acc.email === accountToRemove);
        if (accountIndex !== -1) {
          setExpandedAccounts(prev => ({
            ...prev,
            [accountIndex]: false
          }));
        }
      }
    } catch (error) {
      console.error('Error removing account:', error);
    } finally {
      setShowRemoveModal(false);
      setAccountToRemove(null);
    }
  };

  // Cancel remove account
  const handleCancelRemoveAccount = () => {
    setShowRemoveModal(false);
    setAccountToRemove(null);
  };

  const toggleAccountExpansion = (index) => {
    setExpandedAccounts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddGmail = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowSettingsMenu(false);
  };

  const toggleSettings = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  // Fixed confirmLogout function
  const confirmLogout = async () => {
    try {
      // Firebase logout
      // await signOut(auth);
      
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login - Fixed path
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setShowLogoutModal(false);
  };

  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
      <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
          <p className="text-gray-300 text-sm mb-6">
            Are you sure you want to logout? You'll need to reconnect your Gmail accounts.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RemoveAccountModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
      <div className="bg-black/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Remove Account</h3>
          <p className="text-gray-300 text-sm mb-2">
            Are you sure you want to remove this Gmail account?
          </p>
          <p className="text-orange-300 font-medium text-sm mb-6">
            {accountToRemove}
          </p>
          <p className="text-gray-400 text-xs mb-6">
            This will disconnect the account from Chatterbyte. Your emails will remain in Gmail.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancelRemoveAccount}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemoveAccount}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar - Removed the duplicate div wrapper and fixed positioning */}
      <div className="h-full w-80 bg-gradient-to-b from-gray-900 via-black to-blue-900 border-r border-cyan-500/20 overflow-y-auto scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-cyan-500/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Close button for mobile */}
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Chatterbyte
                </h2>
                <p className="text-gray-400 text-xs">Email Management</p>
              </div>
            </div>
          </div>

          {/* Content Container - Hidden Scrollbar */}
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
            {/* Menu Items */}
            <div className="px-4 py-4">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Navigation
              </h3>
              
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        // Close sidebar on mobile when item clicked
                        if (isMobile && onClose) onClose();
                      }}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                        ${item.active 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-cyan-400'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {(item.count !== undefined && item.count > 0) && (
                        <span className={`
                          text-xs font-bold px-2 py-1 rounded-full
                          ${item.active 
                            ? 'bg-cyan-400/20 text-cyan-300' 
                            : 'bg-gray-600 text-gray-300 group-hover:bg-cyan-400/20 group-hover:text-cyan-300'
                          }
                        `}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-600"></div>

            {/* Connected Gmail Accounts */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Connected Accounts
                </h3>
                <span className="text-cyan-400 font-semibold text-sm">
                  {connectedAccounts.length} Account{connectedAccounts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm p-3">
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                  Loading accounts...
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {connectedAccounts.map((account, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg bg-white/5">
                        {/* Account Header */}
                        <div 
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => toggleAccountExpansion(index)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">G</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 text-sm font-medium truncate">
                              {account.email}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {account.messages?.length || 0} messages
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                            {expandedAccounts[index] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Account Options - Expanded */}
                        {expandedAccounts[index] && (
                          <div className="border-t border-gray-600 p-2 space-y-1">
                            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all text-sm">
                              <Send className="w-4 h-4" />
                              <span>Sent ({account.sent?.length || 0})</span>
                            </button>
                            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all text-sm">
                              <Edit3 className="w-4 h-4" />
                              <span>Drafts ({account.drafts?.length || 0})</span>
                            </button>
                            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 transition-all text-sm">
                              <Archive className="w-4 h-4" />
                              <span>Trash ({account.trash?.length || 0})</span>
                            </button>
                            <div className="border-t border-gray-600 pt-2 mt-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showRemoveConfirmation(account.email);
                                }}
                                className="w-full flex items-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Remove Account</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddGmail}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-600 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-gray-700 group-hover:bg-cyan-500/20 rounded-lg flex items-center justify-center transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Add Gmail Account</span>
                  </button>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-600"></div>

            {/* Settings with Dropdown */}
            <div className="px-4 py-4">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Account
              </h3>
              
              <div className="relative">
                <button 
                  onClick={toggleSettings}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-cyan-400 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </div>
                  {showSettingsMenu ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Settings Dropdown */}
                {showSettingsMenu && (
                  <div className="mt-2 ml-8 space-y-1">
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-cyan-400 transition-all text-sm">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-cyan-400 transition-all text-sm">
                      <Mail className="w-4 h-4" />
                      <span>Preferences</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {userGmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <LogoutModal />}

      {/* Remove Account Modal */}
      {showRemoveModal && <RemoveAccountModal />}
    </>
  );
};

export default Sidebar;