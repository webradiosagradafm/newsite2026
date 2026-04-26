```javascript
// 🔥 ADICIONE ESTE STATE JUNTO DOS OUTROS useState
const [progress, setProgress] = useState(0);


// 🔥 ADICIONE ESTE useEffect JUNTO DOS OUTROS
useEffect(() => {
  const interval = setInterval(() => {
    try {
      const now = new Date();

      const parseTime = (timeStr) => {
        const d = new Date();

        const isAMPM =
          timeStr.toLowerCase().includes('am') ||
          timeStr.toLowerCase().includes('pm');

        let hours = 0;
        let minutes = 0;

        if (isAMPM) {
          const [time, modifier] = timeStr.split(' ');
          [hours, minutes] = time.split(':').map(Number);

          if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
          if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
        } else {
          [hours, minutes] = timeStr.split(':').map(Number);
        }

        // ajuste -2h (RadioBoss)
        hours = hours - 2;

        d.setHours(hours, minutes || 0, 0, 0);
        return d;
      };

      const start = parseTime(program.startTime);
      const end = parseTime(program.endTime);

      const total = end - start;
      const elapsed = now - start;

      let percent = (elapsed / total) * 100;
      percent = Math.max(0, Math.min(100, percent));

      setProgress(percent);
    } catch (e) {
      console.log('Progress error:', e);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [program]);


// ==============================
// 🔻 MOBILE — SUBSTITUA A BARRA
// ==============================

<div className="px-4 py-3">
  <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-full bg-[#ff6600] transition-all duration-1000"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>


// ==============================
// 🔻 DESKTOP — SUBSTITUA A BARRA
// ==============================

<div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 overflow-hidden">
  <div
    className="h-full bg-[#ff6600] transition-all duration-1000"
    style={{ width: `${progress}%` }}
  />
</div>
```
