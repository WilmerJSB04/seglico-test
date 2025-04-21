'use client';

import * as React from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export type DateRangePickerProps = {
  /** The currently selected date range */
  value?: DateRange;
  /** Callback when the date range changes */
  onChange?: (range: DateRange | undefined) => void;
  /** Placeholder text for the date picker button */
  placeholder?: string;
  /** CSS classes to apply to the root element */
  className?: string;
  /** Alignment of the popover */
  align?: 'start' | 'center' | 'end';
  /** Number of months to display */
  numberOfMonths?: number;
  /** Custom format for displaying the date range */
  dateFormat?: string;
  /** Disable the date range picker */
  disabled?: boolean;
};

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Seleccionar rango de fechas",
  className,
  align = 'start',
  numberOfMonths = 2,
  dateFormat = 'dd/MM/yyyy',
  disabled = false,
}: DateRangePickerProps) {
  // Track the selected date range internally
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(value);

  // Update internal state when the value prop changes
  React.useEffect(() => {
    setDateRange(value);
  }, [value]);

  // Handle date range selection
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (onChange) {
      onChange(range);
    }
  };

  // Format date range for display
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    
    const fromDate = format(range.from, dateFormat, { locale: es });
    
    if (!range.to) return `Desde ${fromDate}`;
    
    const toDate = format(range.to, dateFormat, { locale: es });
    return `${fromDate} - ${toDate}`;
  };

  // Clear the selection
  const handleClear = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    handleDateRangeChange(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !dateRange && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{formatDateRange(dateRange)}</span>
            </div>
            {dateRange && (
              <div
                role="button"
                tabIndex={0}
                className="h-5 w-5 p-0 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={numberOfMonths}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
