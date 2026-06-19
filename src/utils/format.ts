// 数字格式化工具

export function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num < 1_000_000_000_000_000) return (num / 1_000_000_000_000).toFixed(1) + 'T';
  return num.toExponential(2);
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${Math.floor(seconds % 60)}秒`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}时${Math.floor((seconds % 3600) / 60)}分`;
  return `${Math.floor(seconds / 86400)}天${Math.floor((seconds % 86400) / 3600)}时`;
}

export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

export function formatPlayTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}时${m}分${s}秒`;
}
