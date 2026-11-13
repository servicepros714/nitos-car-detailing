import { useState } from 'react';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  isSameDay,
  format,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking } from '../../lib/BookingContext.jsx';
import { pacificToday, noSlotsLeftToday } from '../../lib/bookingDb.js';
import './DateStep.css';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DateStep() {
  const { booking, update } = useBooking();
  const today = parseISO(pacificToday());
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));

  const gridStart = startOfWeek(startOfMonth(visibleMonth));
  const gridEnd = endOfWeek(endOfMonth(visibleMonth));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const goPrevMonth = () => {
    const prev = subMonths(visibleMonth, 1);
    if (!isBefore(prev, startOfMonth(today))) setVisibleMonth(prev);
  };
  const goNextMonth = () => setVisibleMonth(addMonths(visibleMonth, 1));

  return (
    <div>
      <p className="eyebrow">Step 2 of 4</p>
      <h1 className="date-step__title">Pick a date</h1>

      <div className="calendar">
        <div className="calendar__header">
          <button
            type="button"
            className="calendar__nav"
            onClick={goPrevMonth}
            disabled={isSameMonth(visibleMonth, today)}
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="calendar__month">{format(visibleMonth, 'MMMM yyyy')}</span>
          <button type="button" className="calendar__nav" onClick={goNextMonth} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendar__weekdays">
          {WEEKDAY_LABELS.map((label, i) => (
            <span key={`${label}-${i}`}>{label}</span>
          ))}
        </div>

        <div className="calendar__grid">
          {days.map((d) => {
            const iso = format(d, 'yyyy-MM-dd');
            const inMonth = isSameMonth(d, visibleMonth);
            // Today closes once no slot is 4 hours away (after 3 PM).
            const isPast = (isBefore(d, today) && !isSameDay(d, today)) || (isSameDay(d, today) && noSlotsLeftToday());
            const selected = booking.date === iso;
            const disabled = !inMonth || isPast;

            return (
              <button
                type="button"
                key={iso}
                disabled={disabled}
                onClick={() => update({ date: iso, time: null })}
                className={`calendar__day ${selected ? 'calendar__day--selected' : ''} ${disabled ? 'calendar__day--disabled' : ''}`}
              >
                {format(d, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
