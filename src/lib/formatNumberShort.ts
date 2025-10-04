export default function formatNumberShort(num: number): string {
  if (num < 1000) return `Rs.${num.toString()}`;

  if (num < 1_00_000) {
    // Up to 99,999 → show as thousands
    return `Rs.${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  } else if (num < 1_00_00_000) {
    // Up to 99,99,999 → show as lakhs
    return `Rs.${(num / 1_00_000).toFixed(1).replace(/\.0$/, "")}L`;
  } else {
    // 1 crore and above
    return `Rs.${(num / 1_00_00_000).toFixed(1).replace(/\.0$/, "")}Cr`;
  }
}
