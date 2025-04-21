'use client';

import * as React from 'react';
import { CalendarIcon, X } from 'lucide-react';
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

export interface DatePickerProps {
  /** The currently selected date */
  selected?: Date;
  /** Callback when the date changes */
  onSelect?: (date: Date | undefined) => void;
  /** Placeholder text for the date picker button */
  placeholder?: string;
  /** CSS classes to apply to the root element */
  className?: string;
  /** Alignment of the popover */
  align?: 'start' | 'center' | 'end';
  /** Custom format for displaying the date */
  dateFormat?: string;
  /** Disable the date picker */
  disabled?: boolean;
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Seleccionar fecha",
  className,
  align = 'start',
  dateFormat = 'dd/MM/yyyy',
  disabled = false,
}: DatePickerProps) {
  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder;
    return format(date, dateFormat, { locale: es });
  };

  // Clear the selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !selected && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{formatDate(selected)}</span>
            </div>
            {selected && (
              <div
                role="button"
                tabIndex={0}
                className="h-5 w-5 p-0 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClear(e as unknown as React.MouseEvent);
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
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
