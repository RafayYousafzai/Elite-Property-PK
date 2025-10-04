function formatNumberShort(num: number): string {
  if (num < 1000) return num.toString();

  if (num < 1_00_000) {
    // Up to 99,999 → show as thousands
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (num < 1_00_00_000) {
    // Up to 99,99,999 → show as lakhs
    return (num / 1_00_000).toFixed(1).replace(/\.0$/, "") + "L";
  } else {
    // 1 crore and above
    return (num / 1_00_00_000).toFixed(1).replace(/\.0$/, "") + "Cr";
  }
}
