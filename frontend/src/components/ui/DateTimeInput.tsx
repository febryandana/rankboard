import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DateTimeInputProps {
  label: string;
  value: string;
  onChange: (isoString: string) => void;
  required?: boolean;
  error?: string;
}

export default function DateTimeInput({
  label,
  value,
  onChange,
  required = false,
  error,
}: DateTimeInputProps) {
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        setDateValue(format(date, 'dd/MM/yyyy'));
        setTimeValue(format(date, 'HH:mm'));
      } catch (e) {
        // Invalid date, keep empty
      }
    }
  }, []);

  useEffect(() => {
    if (dateValue && timeValue) {
      try {
        // Parse DD/MM/YYYY format
        const parsedDate = parse(dateValue, 'dd/MM/yyyy', new Date());
        // Parse HH:mm
        const [hours, minutes] = timeValue.split(':').map(Number);
        parsedDate.setHours(hours, minutes, 0, 0);

        if (!isNaN(parsedDate.getTime())) {
          onChange(parsedDate.toISOString());
        }
      } catch (e) {
        // Invalid date/time combination
      }
    }
  }, [dateValue, timeValue, onChange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^0-9]/g, '');

    if (input.length >= 2) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    if (input.length >= 5) {
      input = input.slice(0, 5) + '/' + input.slice(5);
    }
    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    setDateValue(input);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^0-9]/g, '');

    if (input.length >= 2) {
      input = input.slice(0, 2) + ':' + input.slice(2);
    }
    if (input.length > 5) {
      input = input.slice(0, 5);
    }

    setTimeValue(input);
  };

  const getPreview = () => {
    if (!dateValue || !timeValue) {
      return null;
    }

    try {
      const parsedDate = parse(dateValue, 'dd/MM/yyyy', new Date());
      const [hours, minutes] = timeValue.split(':').map(Number);
      parsedDate.setHours(hours, minutes, 0, 0);

      if (isNaN(parsedDate.getTime())) {
        return null;
      }

      return format(parsedDate, "EEEE, dd MMMM yyyy 'at' HH:mm");
    } catch (e) {
      return null;
    }
  };

  const preview = getPreview();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      {/* Date and Time inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Date input (DD/MM/YYYY) */}
        <div className="space-y-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={dateValue}
              onChange={handleDateChange}
              placeholder="DD/MM/YYYY"
              required={required}
              maxLength={10}
              className={cn(
                'w-full pl-10 pr-3 py-2 bg-background border border-input rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                error && 'border-destructive'
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground">DD/MM/YYYY</p>
        </div>

        {/* Time input (HH:MM) */}
        <div className="space-y-1">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={timeValue}
              onChange={handleTimeChange}
              placeholder="HH:MM"
              required={required}
              maxLength={5}
              className={cn(
                'w-full pl-10 pr-3 py-2 bg-background border border-input rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                error && 'border-destructive'
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground">24-hour (23:59)</p>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-primary/10 border border-primary/20 px-3 py-2 rounded-md">
          <p className="text-sm font-medium text-primary">{preview}</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
