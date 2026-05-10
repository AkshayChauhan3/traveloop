export const formatCurrency = (amount, currency = 'INR') => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatCompact = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

export const getBudgetColor = (spent, budget) => {
  const pct = (spent / budget) * 100
  if (pct >= 100) return 'rose'
  if (pct >= 80) return 'amber'
  return 'emerald'
}

export const getBudgetPercentage = (spent, budget) => {
  return Math.min(Math.round((spent / budget) * 100), 100)
}
