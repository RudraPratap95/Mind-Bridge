import { useState, useEffect, useRef } from 'react';
import './CalmTab.css';
import CalmTimer from '../CalmTimer';

const BREATH_TYPES = [
  { id: 'box', name: 'Box Breathing', desc: '4-4-4-4 pattern for deep focus.', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { id: '478', name: '4-7-8 Technique', desc: 'Relaxes the nervous system.', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { id: 'belly', name: 'Deep Belly', desc: 'Slow rhythmic breathing.', inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
];

const AMBIENT_SOUNDS = [
  { id: 'rain', icon: '🌧️', name: 'Rain' },
  { id: 'forest', icon: '🌿', name: 'Forest' },
  { id: 'ocean', icon: '🌊', name: 'Ocean' },
  { id: 'noise', icon: '📻', name: 'White Noise' }
];

export default function CalmTab() {
  const [activeExercise, setActiveExercise] = useState(null); // breath object or null
  const [phase, setPhase] = useState('Select an exercise above');
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambient, setAmbient] = useState(null);
  const isFinished = useRef(false);
  


  // Breathing phases effect
  useEffect(() => {
    if (!isPlaying || !activeExercise) return;
    
    let isMounted = true;
    let timeout;
    
    const runCycle = async () => {
      while (isMounted && !isFinished.current) {
        if (!isPlaying) {
          await new Promise(r => setTimeout(r, 100)); // Sleep briefly if paused
          continue;
        }
        setPhase('Inhale...');
        await new Promise(r => { timeout = setTimeout(r, activeExercise.inhale * 1000) });
        if (!isMounted || isFinished.current) break;
        
        if (activeExercise.hold1 > 0) {
          setPhase('Hold...');
          await new Promise(r => { timeout = setTimeout(r, activeExercise.hold1 * 1000) });
          if (!isMounted || isFinished.current) break;
        }

        setPhase('Exhale...');
        await new Promise(r => { timeout = setTimeout(r, activeExercise.exhale * 1000) });
        if (!isMounted || isFinished.current) break;
        
        if (activeExercise.hold2 > 0) {
          setPhase('Hold...');
          await new Promise(r => { timeout = setTimeout(r, activeExercise.hold2 * 1000) });
        }
      }
    };
    
    runCycle();
    return () => { isMounted = false; clearTimeout(timeout); };
  }, [isPlaying, activeExercise]);

  const toggleTimer = () => {
    setIsPlaying(!isPlaying);
    isFinished.current = false;
  };

  const handleExpire = () => {
    setIsPlaying(false);
    isFinished.current = true;
    setPhase('Session Complete');
  };

  const getBreathClass = () => {
    if (!isPlaying || !activeExercise) return '';
    if (phase.includes('Inhale')) return 'inhaling';
    if (phase.includes('Exhale')) return 'exhaling';
    return 'holding';
  };

  return (
    <div className="tab-panel calm-zone">
      <div className="calm-header">
        <h2 className="calm-title">Calm Zone 🌷</h2>
        <div className="calm-badge">Sessions completed this week: 4</div>
      </div>

      <div className="section-label">Breathing Exercises</div>
      <div className="breath-cards">
        {BREATH_TYPES.map(bt => (
          <div 
            key={bt.id} 
            className={`breath-card ${activeExercise?.id === bt.id ? 'active' : ''}`}
            onClick={() => {
              setActiveExercise(bt);
              setIsPlaying(false);
              setPhase('Ready');
              isFinished.current = false;
            }}
          >
            <h4>{bt.name}</h4>
            <p>{bt.desc}</p>
          </div>
        ))}
      </div>

      <div className="calm-player-container">
        <div className={`calm-circle ${getBreathClass()}`}>
          <div className="calm-circle-inner">
            <span className="calm-phase-text">{phase}</span>
          </div>
        </div>
        
        <div className="calm-timer-display">
          <CalmTimer key={activeExercise?.id} isPlaying={isPlaying} onExpire={handleExpire} />
          <button className="calm-play-btn" onClick={toggleTimer} disabled={!activeExercise}>
            {isPlaying ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>
      </div>

      <div className="section-label mt20">Guided Meditation Audio</div>
      <div className="audio-player-card">
        <div className="audio-info">
          <div className="audio-icon">🎧</div>
          <div>
            <h5>5-Minute Mindful Check-in</h5>
            <div className="audio-waveform">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="waveform-bar" style={{ height: Math.random() * 20 + 5 + 'px', animationDelay: `${i*0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
        <button className="audio-play-circle">▶</button>
      </div>

      <div className="section-label mt20">Ambient Sounds</div>
      <div className="ambient-selector">
        {AMBIENT_SOUNDS.map(snd => (
          <button 
            key={snd.id}
            className={`ambient-btn ${ambient === snd.id ? 'active' : ''}`}
            onClick={() => setAmbient(ambient === snd.id ? null : snd.id)}
          >
            <span className="ambient-icon">{snd.icon}</span>
            <span>{snd.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
