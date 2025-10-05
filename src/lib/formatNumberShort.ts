export default function formatNumberFull(num: number): string {
  if (num < 1000) return `Rs ${num}`;

  if (num < 1_00_000) {
    return `Rs ${(num / 1000).toFixed(1).replace(/\.0$/, "")} thousand`;
  } else if (num < 1_00_00_000) {
    return `Rs ${(num / 1_00_000).toFixed(1).replace(/\.0$/, "")} lakh`;
  } else {
    return `Rs ${(num / 1_00_00_000).toFixed(1).replace(/\.0$/, "")} crore`;
  }
}
