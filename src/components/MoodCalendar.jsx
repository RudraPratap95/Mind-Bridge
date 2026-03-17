import { useState, useMemo } from 'react';
import './MoodCalendar.css';

// Mood Mapping: Green = Happy, Yellow = Neutral, Orange = Anxious, Red = Sad, Purple = Stressed
const getMoodColorClass = (moodStr) => {
  if (!moodStr) return '';
  const m = moodStr.toLowerCase();
  if (m.includes('😊') || m.includes('happy')) return 'mood-green';
  if (m.includes('😐') || m.includes('neutral')) return 'mood-yellow';
  if (m.includes('😟') || m.includes('anxious') || m.includes('worried')) return 'mood-orange';
  if (m.includes('😢') || m.includes('sad')) return 'mood-red';
  if (m.includes('😡') || m.includes('stressed') || m.includes('angry')) return 'mood-purple';
  return 'mood-yellow'; // fallback
};

export default function MoodCalendar({ entries = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [slideDir, setSlideDir] = useState('');

  // Normalize entries by date string (YYYY-MM-DD)
  const entriesByDate = useMemo(() => {
    const map = {};
    entries.forEach(e => {
      const d = new Date(e.date);
      if (!isNaN(d.getTime())) {
        const dateStr = d.toISOString().split('T')[0];
        // If multiple entries per day, just keep the first/latest one for the calendar color
        if (!map[dateStr]) {
          map[dateStr] = e;
        }
      }
    });
    return map;
  }, [entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Calculate streaks
  const streakDays = useMemo(() => {
    const dates = Object.keys(entriesByDate).sort().reverse();
    const streaks = new Set();
    // simple streak calculation: look backwards from today
    let current = new Date();
    current.setHours(0,0,0,0);
    
    for (let i = 0; i < 30; i++) {
        const dStr = current.toISOString().split('T')[0];
        if (entriesByDate[dStr]) {
            streaks.add(dStr);
        } else {
            // If checking strict streak, we'd break here if i > 0.
            // But let's just highlight any day that has an entry as part of a "streak" or just logged day.
            // Let's highlight consecutive days as gold.
        }
        current.setDate(current.getDate() - 1);
    }
    
    // Better logic: if a day and its previous day have entries, they are part of a streak.
    const strictStreaks = new Set();
    Object.keys(entriesByDate).forEach(dStr => {
      const d = new Date(dStr);
      const prev = new Date(d);
      prev.setDate(d.getDate() - 1);
      const prevStr = prev.toISOString().split('T')[0];
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const nextStr = next.toISOString().split('T')[0];
      
      if (entriesByDate[prevStr] || entriesByDate[nextStr]) {
        strictStreaks.add(dStr);
      }
    });

    return strictStreaks;
  }, [entriesByDate]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    let positive = 0;
    let total = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = new Date(year, month, i).toISOString().split('T')[0];
      const entry = entriesByDate[dStr];
      if (entry) {
        total++;
        const color = getMoodColorClass(entry.mood);
        if (color === 'mood-green' || color === 'mood-yellow') {
            positive++;
        }
      }
    }
    const percent = total === 0 ? 0 : Math.round((positive / total) * 100);
    return { percent, total };
  }, [daysInMonth, entriesByDate, month, year]);

  const handlePrevMonth = () => {
    setSlideDir('slide-right');
    setTimeout(() => {
      setCurrentDate(new Date(year, month - 1, 1));
      setSlideDir('');
    }, 300);
  };

  const handleNextMonth = () => {
    setSlideDir('slide-left');
    setTimeout(() => {
      setCurrentDate(new Date(year, month + 1, 1));
      setSlideDir('');
    }, 300);
  };

  // Generate blank spaces for the first week
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`} className="cal-cell empty"></div>
  ));

  // Generate days
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dateNum = i + 1;
    const dStr = new Date(year, month, dateNum).toISOString().split('T')[0];
    const entry = entriesByDate[dStr];
    const colorClass = entry ? getMoodColorClass(entry.mood) : '';
    const isStreak = streakDays.has(dStr);
    
    return (
      <div 
        key={`day-${dateNum}`} 
        className={`cal-cell ${colorClass} ${isStreak ? 'streak-glow' : ''} ${entry ? 'has-entry' : ''}`}
        onClick={() => {
            if (entry) setSelectedEntry({ date: dStr, ...entry });
            else setSelectedEntry(null);
        }}
      >
        <span className="cal-date-num">{dateNum}</span>
      </div>
    );
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="mood-calendar-container">
      <div className="cal-monthly-summary">
        <div className="summary-text">
          {monthNames[month]} was <strong>{monthlyStats.percent}%</strong> positive days 🌟
        </div>
        <div className="summary-subtext">{monthlyStats.total} entries logged this month.</div>
      </div>

      <div className="cal-header">
        <button className="cal-nav-btn" onClick={handlePrevMonth}>◀</button>
        <h3 className="cal-month-title">{monthNames[month]} {year}</h3>
        <button className="cal-nav-btn" onClick={handleNextMonth}>▶</button>
      </div>

      <div className="cal-grid-wrapper">
        <div className={`cal-grid ${slideDir}`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {blanks}
          {days}
        </div>
      </div>

      <div className="cal-legend">
        <div className="legend-item"><div className="legend-color mood-green"></div><span>Happy</span></div>
        <div className="legend-item"><div className="legend-color mood-yellow"></div><span>Neutral</span></div>
        <div className="legend-item"><div className="legend-color mood-orange"></div><span>Anxious</span></div>
        <div className="legend-item"><div className="legend-color mood-red"></div><span>Sad</span></div>
        <div className="legend-item"><div className="legend-color mood-purple"></div><span>Stressed</span></div>
      </div>

      {selectedEntry && (
        <div className="cal-entry-preview animate-pop">
          <div className="preview-header">
            <h4>{selectedEntry.date}</h4>
            <button className="preview-close" onClick={() => setSelectedEntry(null)}>✕</button>
          </div>
          <div className="preview-mood">{selectedEntry.mood}</div>
          <p className="preview-text">"{selectedEntry.text}"</p>
        </div>
      )}
    </div>
  );
}
