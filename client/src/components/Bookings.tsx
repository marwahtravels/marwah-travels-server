import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingModal from './BookingModal';
import { http } from '../lib/http';
import {
  Search,
  Plus,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';

type UiBooking = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  package: string;
  departureDate: string; // YYYY-MM-DD or ''
  returnDate: string;    // YYYY-MM-DD or ''
  status: 'pending' | 'confirmed' | 'cancelled' | string;
  amount: number;        // stored as number; format when rendering
  agentId?: string;
  agentName?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | string;
};

function formatDate(d?: string | null): string {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.valueOf())) return '';
  return dt.toISOString().slice(0, 10);
}

function toNumberMaybe(v: any): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'string') {
    const n = Number(v.replace?.(/[$,]/g, '') ?? v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function currency(n: number) {
  try {
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

/** Normalize API booking -> UI booking */
function mapBooking(b: any): UiBooking {
  // try both old & new fields safely
  const id = b?._id || b?.id || crypto.randomUUID();
  const customer = b?.customerName ?? b?.customer ?? 'Unknown';
  const email = b?.customerEmail ?? b?.email ?? '';
  const phone = b?.contactNumber ?? b?.phone ?? '';
  const pkg = b?.package ?? b?.pricing?.packageName ?? '—';

  const amount =
    toNumberMaybe(b?.amount) || toNumberMaybe(b?.pricing?.totalAmount) || 0;

  const dep = b?.flight?.departureDate ?? b?.departureDate ?? '';
  const ret = b?.flight?.returnDate ?? b?.returnDate ?? '';

  const status = (b?.status ?? 'pending') as UiBooking['status'];
  const approvalStatus = b?.approvalStatus ?? 'pending';

  const agentId = b?.agentId ?? b?.agent?.id;
  const agentName = b?.agentName ?? b?.agent?.name ?? '';

  return {
    id,
    customer,
    email,
    phone,
    package: pkg,
    departureDate: formatDate(dep),
    returnDate: formatDate(ret),
    status,
    amount,
    agentId,
    agentName,
    approvalStatus,
  };
}

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchBookings = async () => {
    setLoading(true);
    setErr('');
    try {
      const url = isAdmin ? '/api/bookings' : '/api/bookings/my';
      const { data } = await http.get(url);
      // data can be array or {bookings: []}
      const list = Array.isArray(data) ? data : (data?.bookings ?? []);
      setBookings(list.map(mapBooking));
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === 'string' ? e.response.data : '') ||
        e?.message ||
        'Failed to load bookings';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Accept the created object from BookingModal and prepend to list
  const handleCreateBooking = (created: any) => {
    const ui = mapBooking(created);
    setBookings((prev) => [ui, ...prev]);
  };

  // Deletion
  const handleDelete = async (id: string) => {
    const yes = window.confirm('Delete this booking?');
    if (!yes) return;
    const prev = bookings;
    setBookings((p) => p.filter((b) => b.id !== id));
    try {
      await http.delete(`/api/bookings/${id}`);
    } catch (e) {
      // rollback on error
      setBookings(prev);
      alert('Delete failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const displayBookings = useMemo(() => {
    // For agents we already fetched /my, but if you later switch to global fetch:
    return isAdmin ? bookings : bookings.filter((b) => b.agentId === (user as any)?.agentId);
  }, [bookings, isAdmin, user]);

  const filteredBookings = displayBookings.filter((booking) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      booking.customer.toLowerCase().includes(s) ||
      booking.id.toLowerCase().includes(s) ||
      booking.package.toLowerCase().includes(s) ||
      booking.email.toLowerCase().includes(s);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (toNumberMaybe(b.amount) || 0), 0);
  const totalConfirmed = filteredBookings.filter((b) => b.status === 'confirmed').length;
  const totalPending = filteredBookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'All Bookings' : 'My Bookings'}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-600">Bookings</span>
          </div>
        </div>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-gray-600">Loading bookings…</div>
      )}
      {err && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{err}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {filteredBookings.length}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {totalConfirmed}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {totalPending}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {currency(totalRevenue)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            {/* Booking Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{booking.customer}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{booking.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="truncate">{booking.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{booking.phone || '—'}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{booking.package}</span>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Departure</p>
                  <p className="font-medium text-gray-900">{booking.departureDate || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Return</p>
                  <p className="font-medium text-gray-900">{booking.returnDate || '—'}</p>
                </div>
              </div>
            </div>

            {/* Amount and Agent */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Amount</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{currency(booking.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-500">Agent</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900">{booking.agentName || '—'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                disabled
                title="Edit coming soon"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(booking.id)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Delete</span>
              </button>
            </div>

            {/* Approval Status */}
            {booking.approvalStatus === 'pending' && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium">Pending Admin Approval</p>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {!loading && !err && filteredBookings.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first booking'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
};

export default Bookings;
