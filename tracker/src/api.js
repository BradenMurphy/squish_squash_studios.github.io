async function req(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const getCustomers = (search = '') =>
  req(`/api/customers?search=${encodeURIComponent(search)}`);

export const createCustomer = (data) =>
  req('/api/customers', { method: 'POST', body: JSON.stringify(data) });

export const getAttendance = (date) =>
  req(`/api/attendance?date=${encodeURIComponent(date)}`);

export const addAttendance = (customer_id, class_date) =>
  req('/api/attendance', {
    method: 'POST',
    body: JSON.stringify({ customer_id, class_date }),
  });

export const removeAttendance = (id) =>
  req(`/api/attendance/${id}`, { method: 'DELETE' });

export const getStats = () => req('/api/stats');
