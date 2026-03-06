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

interface OrderItem {
  productName: string;
  quantity: number;
  sellingPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  uuid: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-gray-200 border-t-blue-600 rounded-full w-8 h-8 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">View and manage your orders</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/account" className="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition">
                  Profile
                </Link>
                <Link href="/account/orders" className="block px-4 py-2 rounded bg-blue-50 text-blue-600 font-medium">
                  Orders
                </Link>
                <Link href="/account/settings" className="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Orders List */}
          <div className="md:col-span-2">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet.</p>
                <Link href="/shop" className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-gray-900">#{order.uuid.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className={`font-semibold capitalize ${
                          order.status === 'pending' ? 'text-yellow-600' :
                          order.status === 'processing' ? 'text-blue-600' :
                          order.status === 'completed' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">GH₵{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-600">
                            <span>{item.productName} × {item.quantity}</span>
                            <span>GH₵{item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                      <Link
                        href={`/account/orders/${order.uuid}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
