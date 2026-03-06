'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
}

interface Order {
  id: number;
  uuid: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    sellingPrice: number;
  }>;
}

type TabType = 'profile' | 'orders' | 'settings';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }
    try {
      const userData = JSON.parse(stored);
      setUser(userData);

      // Fetch orders from API
      fetch(`/api/user/orders?userId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            setOrders(data.orders);
          }
        })
        .catch((err) => console.error('Failed to fetch orders:', err))
        .finally(() => setLoading(false));
    } catch (err) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner border-4 border-gray-200 border-t-blue-600 rounded-full w-8 h-8 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with User Info */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition font-medium text-sm"
            >
              Logout
            </button>
          </div>

          {/* Horizontal Tabs */}
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 font-medium transition ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 font-medium transition ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 font-medium transition ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                  <p className="text-lg text-gray-900 font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                  <p className="text-lg text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                  <p className="text-lg text-gray-900 font-medium">{user.phone || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                  <p className="text-lg text-gray-900 font-medium">{user.city || '—'}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className="mt-8 bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{orders.length}</div>
                <p className="text-gray-600 font-medium">Total Orders</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-pink-600 mb-2">0</div>
                <p className="text-gray-600 font-medium">Wishlist Items</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                <Link
                  href="/shop"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order #{order.uuid.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700">
                          {item.productName} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                      <p className="text-gray-600">Total:</p>
                      <p className="text-lg font-bold text-gray-900">
                        GH₵{parseFloat(order.totalAmount.toString()).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Edit Name</h3>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Edit Phone</h3>
                <input
                  type="tel"
                  defaultValue={user.phone || ''}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Edit City</h3>
                <input
                  type="text"
                  defaultValue={user.city || ''}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
