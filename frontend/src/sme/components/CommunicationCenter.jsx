import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunicationCenter = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Mock data - replace with actual API call
      const mockMessages = [
        {
          id: 1,
          from: {
            name: 'Lagos Investment Partners',
            type: 'lender',
            avatar: null
          },
          subject: 'Milestone Progress Update',
          message: 'Great progress on the inventory expansion! The new product lines are showing strong sales. Keep up the excellent work. Looking forward to the next milestone completion.',
          timestamp: '2024-11-12T14:30:00Z',
          type: 'positive',
          milestoneId: 1,
          isRead: false,
          hasReplied: false
        },
        {
          id: 2,
          from: {
            name: 'Abuja Capital Fund',
            type: 'lender',
            avatar: null
          },
          subject: 'Documentation Request',
          message: 'Please provide more detailed breakdown of marketing expenses for better tracking. We need itemized receipts for the digital advertising spend mentioned in your last report.',
          timestamp: '2024-11-10T09:15:00Z',
          type: 'request',
          milestoneId: 2,
          isRead: true,
          hasReplied: true
        },
        {
          id: 3,
          from: {
            name: 'Lagos Investment Partners',
            type: 'lender',
            avatar: null
          },
          subject: 'Investment Offer Update',
          message: 'Thank you for your counter-offer. We have reviewed your terms and are pleased to accept your proposal. The updated agreement will be sent shortly.',
          timestamp: '2024-11-08T16:45:00Z',
          type: 'positive',
          milestoneId: null,
          isRead: true,
          hasReplied: false
        },
        {
          id: 4,
          from: {
            name: 'System Notification',
            type: 'system',
            avatar: null
          },
          subject: 'Milestone Evidence Approved',
          message: 'Your evidence for "Initial Working Capital" milestone has been approved. ₦2,000,000 has been released to your account. Transaction ID: TXN_001234',
          timestamp: '2024-11-05T11:20:00Z',
          type: 'info',
          milestoneId: 1,
          isRead: true,
          hasReplied: false
        }
      ];
      
      setMessages(mockMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleReply = async (messageId, replyText) => {
    try {
      const response = await fetch(`/api/sme/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: replyText
        })
      });

      if (response.ok) {
        // Update message as replied
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, hasReplied: true }
            : msg
        ));
        setShowReplyModal(false);
        setSelectedMessage(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const markAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isRead: true }
        : msg
    ));
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'positive': return 'thumb_up';
      case 'request': return 'help';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'chat';
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'request': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-pulse-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pulse-dark dark:text-white">Communication Center</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {messages.length} messages • {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="bg-white dark:bg-pulse-navy rounded-xl p-12 text-center shadow-soft">
          <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">chat</span>
          <h3 className="text-xl font-bold text-pulse-dark dark:text-white mb-2">No Messages Yet</h3>
          <p className="text-gray-500">Messages from lenders and system notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`bg-white dark:bg-pulse-navy rounded-xl shadow-soft border p-6 cursor-pointer transition-all ${
                !message.isRead ? 'border-l-4 border-l-pulse-cyan' : 'border-gray-200 dark:border-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => markAsRead(message.id)}
              whileHover={{ y: -2 }}
            >
              {/* Message Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    message.from.type === 'system' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-pulse-cyan/20'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      message.from.type === 'system' ? 'text-purple-600' : 'text-pulse-cyan'
                    }`}>
                      {message.from.type === 'system' ? 'notifications' : 'account_balance'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-pulse-dark dark:text-white">
                      {message.from.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!message.isRead && (
                    <span className="w-3 h-3 bg-pulse-cyan rounded-full"></span>
                  )}
                  <span className={`material-symbols-outlined ${getMessageColor(message.type).split(' ')[0]}`}>
                    {getMessageIcon(message.type)}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <h4 className="font-semibold text-pulse-dark dark:text-white mb-2">
                {message.subject}
              </h4>

              {/* Message Content */}
              <div className={`p-4 rounded-lg border ${getMessageColor(message.type)}`}>
                <p className="text-sm">
                  {message.message}
                </p>
              </div>

              {/* Milestone Reference */}
              {message.milestoneId && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <span className="material-symbols-outlined text-xs">flag</span>
                  Related to Milestone #{message.milestoneId}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {message.hasReplied && (
                    <span className="flex items-center gap-1 text-green-600">
                      <span className="material-symbols-outlined text-xs">check</span>
                      Replied
                    </span>
                  )}
                </div>
                {message.from.type !== 'system' && !message.hasReplied && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(message);
                      setShowReplyModal(true);
                    }}
                    className="px-4 py-2 text-pulse-cyan border border-pulse-cyan rounded-lg hover:bg-pulse-cyan/10 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reply
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedMessage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReplyModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-pulse-navy rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-pulse-dark dark:text-white">
                    Reply to {selectedMessage.from.name}
                  </h3>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Original Message */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Original Message:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      "{selectedMessage.message}"
                    </p>
                  </div>

                  {/* Reply Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pulse-cyan dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Type your reply here..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowReplyModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={() => handleReply(selectedMessage.id, replyText)}
                      disabled={!replyText.trim()}
                      className="flex-1 px-4 py-3 pulse-gradient-bg text-white rounded-lg font-medium disabled:opacity-50"
                      whileHover={{ scale: replyText.trim() ? 1.02 : 1 }}
                      whileTap={{ scale: replyText.trim() ? 0.98 : 1 }}
                    >
                      Send Reply
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunicationCenter;