import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SCHEDULES } from '../constants';
import { Program } from '../types';

interface ScheduleListProps {
  onNavigateToProgram: (program: Program) => void;
  onBack?: () => void;
}

const getChicagoDate = (baseDate: Date = new Date()) => {
  return new Date(baseDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
};

const format12h = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
};

const ProgramProgressRing: React.FC<{ program: Program; isActive: boolean; nowMinutes: number }> = ({
  program,
  isActive,
  nowMinutes
}) => {
  const progress = useMemo(() => {
    if (!isActive) return 0;

    const [sH, sM] = program.startTime.split(':').map(Number);
    const [eH, eM] = program.endTime.split(':').map(Number);

    const start = sH * 60 + sM;
    let end = eH * 60 + eM;

    if (end === 0 || end <= start) end = 24 * 60;

    const elapsed = nowMinutes - start;
    const duration = end - start;

    return Math.min(Math.max(elapsed / duration, 0), 1);
  }, [program, isActive, nowMinutes]);

  const size = 120;
  const strokeWidth = 3;

  return (
    <div className="relative flex-shrink-0 flex items-center justify-center bg-[#f2f2f2] dark:bg-[#1a1a1a] p-3 group-hover:scale-105 transition-transform duration-500">
      <div className="relative rounded-full overflow-hidden" style={{ width: size - 24, height: size - 24 }}>
        <img
          src={program.image}
          alt=""
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />

        <svg width={size - 24} height={size - 24} className="absolute inset-0 -rotate-90">
          <circle
            cx={(size - 24) / 2}
            cy={(size - 24) / 2}
            r={(size - 24) / 2 - strokeWidth / 2}
            stroke="#dbdbdb"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="dark:stroke-white/10"
          />

          {isActive && (
            <circle
              cx={(size - 24) / 2}
              cy={(size - 24) / 2}
              r={(size - 24) / 2 - strokeWidth / 2}
              stroke="#ff6600"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={2 * Math.PI * ((size - 24) / 2 - strokeWidth / 2)}
              strokeDashoffset={
                2 * Math.PI * ((size - 24) / 2 - strokeWidth / 2) -
                progress * 2 * Math.PI * ((size - 24) / 2 - strokeWidth / 2)
              }
            />
          )}
        </svg>
      </div>
    </div>
  );
};

const dayMeta = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const ScheduleList: React.FC<ScheduleListProps> = ({ onNavigateToProgram, onBack }) => {
  const [now, setNow] = useState(getChicagoDate());
  const [selectedDay, setSelectedDay] = useState(getChicagoDate().getDay());
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(getChicagoDate()), 30000);
    return () => clearInterval(timer);
  }, []);

  const weekDays = useMemo(() => {
    const today = getChicagoDate();
    const currentDay = today.getDay();

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);

      return {
        value: i,
        dayLabel: dayMeta[i],
        dateLabel: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase(),
        fullLabel: date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }),
        isToday: i === currentDay,
        isSunday: i === 0,
      };
    });
  }, [now]);

  const selectedDayInfo = weekDays.find((d) => d.value === selectedDay) || weekDays[0];

  const currentSchedule = useMemo(() => {
    return SCHEDULES[selectedDay] || SCHEDULES[1];
  }, [selectedDay]);

  const sections = useMemo(() => {
    const groups: Record<string, Program[]> = {
      EARLY: [],
      MORNING: [],
      AFTERNOON: [],
      EVENING: [],
      LATE: []
    };

    currentSchedule.forEach((prog) => {
      const h = parseInt(prog.startTime.split(':')[0], 10);
      if (h < 6) groups.EARLY.push(prog);
      else if (h < 12) groups.MORNING.push(prog);
      else if (h < 18) groups.AFTERNOON.push(prog);
      else if (h < 22) groups.EVENING.push(prog);
      else groups.LATE.push(prog);
    });

    return groups;
  }, [currentSchedule]);

  const isLiveNow = (startStr: string, endStr: string) => {
    if (selectedDay !== now.getDay()) return false;

    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);

    const start = sH * 60 + sM;
    let end = eH * 60 + eM;

    if (end === 0 || end <= start) end = 24 * 60;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return nowMinutes >= start && nowMinutes < end;
  };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <section ref={listContainerRef} className="bg-white dark:bg-[#000] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">

        {onBack && (
          <button onClick={onBack} className="flex items-center text-gray-400 hover:text-[#ff6600] mb-6 text-xs uppercase">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
          </button>
        )}

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold uppercase mb-4">Schedule</h1>
          <p className="text-gray-400 text-sm uppercase">
            {selectedDayInfo.isToday ? 'Today' : selectedDayInfo.dayLabel} • {selectedDayInfo.fullLabel}
          </p>
        </div>

        {/* CARROSSEL BBC */}
        <div className="bg-[#1a1f22] overflow-x-auto mb-10">
          <div className="flex min-w-max">
            {weekDays.map((day) => {
              const active = selectedDay === day.value;

              return (
                <button
                  key={day.value}
                  onClick={() => setSelectedDay(day.value)}
                  className={`min-w-[96px] px-4 py-3 text-center transition-all ${
                    active ? 'bg-white text-black' : 'text-[#ffe600]'
                  }`}
                >
                  <div className="text-[11px] font-bold">
                    {day.isToday ? 'TODAY' : day.isSunday ? 'SUN ✝' : day.dayLabel}
                  </div>
                  <div className="text-[18px] font-bold">
                    {day.dateLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* BROWSE CLEAN */}
        <div className="mb-12 text-[11px] uppercase tracking-[0.25em] text-gray-400 flex flex-wrap gap-6">
          <span>Browse</span>
          {(Object.keys(sections) as string[]).map((title) => (
            <button
              key={title}
              onClick={() => document.getElementById(title)?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#ff6600]"
            >
              {title === 'EARLY' && 'Early Hours'}
              {title === 'MORNING' && 'Morning'}
              {title === 'AFTERNOON' && 'Afternoon'}
              {title === 'EVENING' && 'Evening'}
              {title === 'LATE' && 'Late Night'}
            </button>
          ))}
        </div>

        {/* LISTA */}
        {(Object.entries(sections) as [string, Program[]][]).map(([title, items]) =>
          items.length > 0 && (
            <div key={title} id={title} className="mb-20">
              <h3 className="text-xl font-bold mb-6">{title}</h3>

              {items.map((prog) => {
                const active = isLiveNow(prog.startTime, prog.endTime);

                return (
                  <div key={prog.id} className={`p-6 mb-6 ${active ? 'border-l-4 border-[#ff6600]' : ''}`}>
                    <div className="text-xl font-bold">{prog.title}</div>
                    <div className="text-sm text-gray-400">{format12h(prog.startTime)}</div>
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>
    </section>
  );
};

export default ScheduleList;