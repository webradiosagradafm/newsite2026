import React from 'react';

const days = [
  { label: 'Sun', value: 0, special: true },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

interface Props {
  selectedDay: number;
  onChange: (day: number) => void;
}

const DaySelector: React.FC<Props> = ({ selectedDay, onChange }) => {
  return (
    <div className="flex overflow-x-auto gap-2 py-3 px-2">
      {days.map((day) => (
        <button
          key={day.value}
          onClick={() => onChange(day.value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
            ${
              selectedDay === day.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700'
            }
            ${day.special ? 'border-2 border-[#ff6600]' : ''}
          `}
        >
          {day.special ? '✝️ ' : ''}
          {day.label}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;