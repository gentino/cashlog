// Groups transactions by calendar day, returning an array of daily summaries
// sorted most-recent-first.
export function groupTransactionsByDay(transactions) {
  const groups = {};

  transactions.forEach((t) => {
    const dayKey = new Date(t.date).toDateString();
    if (!groups[dayKey]) {
      groups[dayKey] = { date: t.date, sales: 0, expenses: 0 };
    }
    if (t.type === 'sale') {
      groups[dayKey].sales += t.amount;
    } else {
      groups[dayKey].expenses += t.amount;
    }
  });

  return Object.values(groups)
    .map((g) => ({ ...g, net: g.sales - g.expenses }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function formatLongDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Filters a list of daily summaries down to a given range
export function filterByRange(dailySummaries, range) {
  const now = new Date();

  return dailySummaries.filter((day) => {
    const d = new Date(day.date);
    if (range === 'Today') {
      return d.toDateString() === now.toDateString();
    }
    if (range === 'This Week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek;
    }
    if (range === 'This Month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

// Filters raw transactions (not daily summaries) by a wider period
export function filterTransactionsByPeriod(transactions, period) {
  const now = new Date();

  return transactions.filter((t) => {
    const d = new Date(t.date);
    if (period === 'This Month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (period === 'Last Month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    }
    if (period === 'This Year') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

// Returns sales totals for the last 7 calendar days, labeled Mon-Sun in order
export function getLast7DaysSales(transactions) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const last7 = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7.push({ dateKey: d.toDateString(), label: days[d.getDay()], value: 0 });
  }

  transactions.forEach((t) => {
    if (t.type !== 'sale') return;
    const key = new Date(t.date).toDateString();
    const day = last7.find((d) => d.dateKey === key);
    if (day) day.value += t.amount;
  });

  return last7;
}