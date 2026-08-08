const combos = new Set()
for (let day = 0; day < 30; day++) {
  const b = (day * 7 + 1) % 10
  const l = (day * 11 + 3) % 10
  const s = (day * 13 + 5) % 10
  const d = (day * 9 + 7) % 10
  const key = b + '-' + l + '-' + s + '-' + d
  combos.add(key)
}
console.log('Unique meal combos across 30 days:', combos.size)
