import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, RefreshCw, Search } from 'lucide-react';
import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminCustomers() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCustomers = useCallback(async () => {
    if (!isAuthenticated || !hasRole('ADMIN')) return;
    setLoading(true);
    setError('');
    try {
      const result = await apiRequest('/admin/customers');
      setCustomers(Array.isArray(result) ? result : (result?.content ?? []));
    } catch (err) {
      setError(err?.message || 'Unable to load customers.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, hasRole]);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  const filtered = useMemo(() => customers.filter(c =>
    [c.firstName, c.lastName, c.email, c.mobile]
      .filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase())
  ), [customers, search]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#243A34]">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">View registered customers.</p>
        </div>
        <button type="button" onClick={loadCustomers} disabled={loading || !isAuthenticated || !hasRole('ADMIN')}
          className="px-4 py-2 rounded-xl border border-[#E8E3D8] bg-white text-sm flex items-center gap-2 disabled:opacity-50">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">Total Customers: <strong>{customers.length}</strong></p>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="pl-9 pr-4 py-2 rounded-xl border border-[#E8E3D8] bg-white text-sm outline-none" />
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-[#E8E3D8] overflow-x-auto">
        {!isAuthenticated || !hasRole('ADMIN') ? (
          <div className="min-h-56 flex items-center justify-center text-red-600 text-sm p-6">
            Please sign in with an Admin account.
          </div>
        ) : loading ? (
          <div className="min-h-56 flex items-center justify-center text-gray-500 text-sm">Loading customers...</div>
        ) : error ? (
          <div className="min-h-56 flex flex-col items-center justify-center gap-3 p-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={loadCustomers} className="px-4 py-2 rounded-lg bg-[#243A34] text-white text-sm">Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="min-h-56 flex flex-col items-center justify-center text-gray-400 p-6">
            <Users size={42} strokeWidth={1.3} />
            <p className="mt-3 text-sm">{search ? 'No matching customers.' : 'No registered customers found.'}</p>
          </div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F8F6F1] text-[#243A34]">
              <tr>{['Name', 'Email', 'Mobile', 'Registered', 'Status'].map(h =>
                <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="px-5 py-4 font-medium">{[c.firstName, c.lastName].filter(Boolean).join(' ') || '-'}</td>
                  <td className="px-5 py-4">{c.email || '-'}</td>
                  <td className="px-5 py-4">{c.mobile || '-'}</td>
                  <td className="px-5 py-4">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="px-5 py-4">{c.enabled ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
