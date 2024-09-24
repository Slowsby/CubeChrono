export const defaultTimeFormat = (time, isRunning) => {
  if (time === null || time === '--') {
    return '--';
  }
  const n = parseFloat(time);
  if (n >= 60) {
    const minutes = Math.floor(n / 60);
    const seconds = Math.floor(n - minutes * 60)
      .toString()
      .padStart(2, '0');
    const milliseconds = Math.floor((n - Math.floor(n)) * 100);
    return isRunning
      ? `${minutes}:${seconds}`
      : `${minutes}:${seconds}.${milliseconds}`;
  } else {
    return isRunning ? n.toFixed(1) : n.toFixed(2);
  }
};
