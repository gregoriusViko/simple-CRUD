export const rupiahFormatter = (value: number) => {
  if (!value && value !== 0) return ''

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}
