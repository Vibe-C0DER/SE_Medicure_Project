import React, { useEffect, useState } from 'react';
import { getAdminContactMessages, markContactMessageRead, deleteContactMessage } from '../../api/admin.api';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminContactMessages();
      setMessages(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await markContactMessageRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkRead(msg._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Contact Inbox</h2>
          <p className="text-sm text-slate-500">Manage user inquiries and messages</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-10 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-3xl text-pink-500">sync</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 py-24">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-slate-300">inbox</span>
            </div>
            <p className="text-sm font-semibold">No messages available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Sender</th>
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr 
                    key={msg._id} 
                    onClick={() => openMessage(msg)}
                    className={`border-b border-slate-50 hover:bg-pink-50/50 transition-colors cursor-pointer ${!msg.isRead ? 'bg-slate-50/50 font-semibold' : ''}`}
                  >
                    <td className="p-4">
                      {!msg.isRead ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-md w-max">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div> New
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Read</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-800">{msg.name}</div>
                      <div className="text-xs text-slate-500 font-normal">{msg.email}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700 truncate max-w-[200px]">
                      {msg.subject}
                    </td>
                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      {!msg.isRead && (
                        <button 
                          onClick={(e) => handleMarkRead(msg._id, e)} 
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex tooltip-parent relative"
                          title="Mark as Read"
                        >
                          <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleDelete(msg._id, e)} 
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <h3 className="font-bold text-xl text-slate-800 mb-1">{selectedMessage.subject}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-700">{selectedMessage.name}</span>
                  <span className="text-slate-400">&lt;{selectedMessage.email}&gt;</span>
                </div>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined mt-1">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="text-xs text-slate-400 mb-4 bg-slate-100 inline-block px-3 py-1 rounded-full">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                {selectedMessage.message}
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => handleDelete(selectedMessage._id)} 
                className="px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors text-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span> Delete
              </button>
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;
