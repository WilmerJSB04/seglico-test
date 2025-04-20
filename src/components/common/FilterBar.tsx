"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define the types of filters that can be displayed
export type FilterType = 
    | "search"
    | "project" 
    | "penalty_type" 
    | "penalty_reason" 
    | "date_range" 
    | "document" 
    | "operator"
    | "employee_id"
    | "penalty_employee_id"
    | "responsible_id"
    | "penalty_id"
    | "status"
    | "date_start"
    | "date_end"
    | "date_range_until"
    | "project_id"
    | "penalty_reason_id"
    | "penalty_type_id"
    | "document_id";    


// Interface for filter options (for select inputs)
export interface FilterOption {
  value: string | number;
  label: string;
}

// Props for the FilterBar component
export interface FilterBarProps {
  // List of filter types to display
  filterTypes: FilterType[];
  // Initial filter values
  initialFilters?: Record<string, any>;
  // Options for select inputs
  filterOptions?: {
    projects?: FilterOption[];
    penaltyTypes?: FilterOption[];
    penaltyReasons?: FilterOption[];
    documents?: FilterOption[];
    operators?: FilterOption[];
  };
  // Callback when filters change
  onFiltersChange: (filters: Record<string, any>) => void;
  // Optional placeholder text for search
  searchPlaceholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterTypes,
  initialFilters = {},
  filterOptions = {},
  onFiltersChange,
  searchPlaceholder = "Buscar..."
}) => {

  const [filters, setFilters] = useState<Record<string, any>>({
    ...initialFilters
  });

  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);

  useEffect(() => {
    onFiltersChange(filters);
    
    // Update active filters
    const active = Object.entries(filters)
      .filter(([_, value]) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
      .map(([key]) => key as FilterType);
    
    setActiveFilters(active);
  }, [filters, onFiltersChange]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle select change
  const handleSelectChange = (value: string, filterKey: string) => {
    if (value === "all") {
      setFilters(prev => ({ ...prev, [filterKey]: undefined }));
    } else {
      const numValue = Number(value);
      const finalValue = !isNaN(numValue) ? numValue : value;
      setFilters(prev => ({ ...prev, [filterKey]: finalValue }));
    }
  };

  const handleDateChange = (date: Date | undefined, dateType: 'date_start' | 'date_end') => {
    setFilters(prev => ({ ...prev, [dateType]: date }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  // Clear a specific filter
  const clearFilter = (filterKey: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: undefined }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: Record<string, any> = {};
    filterTypes.forEach(type => {
      if (type === "date_range") {
        clearedFilters.date_start = undefined;
        clearedFilters.date_end = undefined;
      } else {
        clearedFilters[type] = undefined;
      }
    });
    setFilters(clearedFilters);
  };

  // Count how many active filters we have
  const activeFilterCount = activeFilters.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search filter */}
        {filterTypes.includes("search") && (
          <div className="flex items-center space-x-2 min-w-[200px] max-w-sm flex-grow">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="w-full"
            />
            <Button type="submit" size="icon" className="px-3">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Project filter */}
        {filterTypes.includes("project") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.project_id?.toString() || "all"}
              onValueChange={(value) => handleSelectChange(value, "project_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proyectos</SelectItem>
                {filterOptions.projects?.map((project) => (
                  <SelectItem key={project.value} value={project.value.toString()}>
                    {project.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Penalty Type filter */}
        {filterTypes.includes("penalty_type") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.penalty_type_id?.toString() || "all"}
              onValueChange={(value) => handleSelectChange(value, "penalty_type_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de sanción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {filterOptions.penaltyTypes?.map((type) => (
                  <SelectItem key={type.value} value={type.value.toString()}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Penalty Reason filter */}
        {filterTypes.includes("penalty_reason") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.penalty_reason_id?.toString() || "all"}
              onValueChange={(value) => handleSelectChange(value, "penalty_reason_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los motivos</SelectItem>
                {filterOptions.penaltyReasons?.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value.toString()}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Range filters */}
        {filterTypes.includes("date_range") && (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[150px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date_start ? (
                    formatDate(filters.date_start)
                  ) : (
                    <span>Fecha inicio</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date_start}
                  onSelect={(date) => handleDateChange(date, 'date_start')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[150px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date_end ? (
                    formatDate(filters.date_end)
                  ) : (
                    <span>Fecha fin</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={filters.date_end}
                  onSelect={(date) => handleDateChange(date, 'date_end')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Document filter */}
        {filterTypes.includes("document") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.document_id?.toString() || "all"}
              onValueChange={(value) => handleSelectChange(value, "document_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los documentos</SelectItem>
                {filterOptions.documents?.map((doc) => (
                  <SelectItem key={doc.value} value={doc.value.toString()}>
                    {doc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Operator filter */}
        {filterTypes.includes("operator") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.employee_id?.toString() || "all"}
              onValueChange={(value) => handleSelectChange(value, "employee_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Operario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los operarios</SelectItem>
                {filterOptions.operators?.map((operator) => (
                  <SelectItem key={operator.value} value={operator.value.toString()}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Filter action buttons */}
        <div className="flex gap-2 ml-auto">
          {activeFilterCount > 0 && (
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
              <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
            </Button>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtros aplicados</h4>
                
                {activeFilterCount === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay filtros aplicados</p>
                ) : (
                  <div className="space-y-2">
                    {filters.search && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Búsqueda: {filters.search}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearFilter('search')}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {filters.project_id && filterOptions.projects && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Proyecto: {filterOptions.projects.find(p => p.value.toString() === filters.project_id?.toString())?.label}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearFilter('project_id')}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {filters.penalty_type_id && filterOptions.penaltyTypes && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Tipo: {filterOptions.penaltyTypes.find(t => t.value.toString() === filters.penalty_type_id?.toString())?.label}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearFilter('penalty_type_id')}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {filters.date_start && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Fecha inicio: {formatDate(filters.date_start)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearFilter('date_start')}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {filters.date_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Fecha fin: {formatDate(filters.date_end)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearFilter('date_end')}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Other active filters */}
                  </div>
                )}
                
                {activeFilterCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFilters} 
                    className="w-full mt-2"
                  >
                    Limpiar todos los filtros
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <Card className="bg-muted/40 border-dashed">
          <CardContent className="p-3 flex flex-wrap gap-2">
            {activeFilters.map(filterKey => {
              let label = "";
              let value = "";

              // Generate label and value based on filter key
              if (filterKey === "search") {
                label = "Búsqueda";
                value = filters.search;
              } else if (filterKey === "project_id" && filterOptions.projects) {
                label = "Proyecto";
                const project = filterOptions.projects.find(p => p.value.toString() === filters.project_id?.toString());
                value = project?.label || "";
              } else if (filterKey === "penalty_type_id" && filterOptions.penaltyTypes) {
                label = "Tipo";
                const type = filterOptions.penaltyTypes.find(t => t.value.toString() === filters.penalty_type_id?.toString());
                value = type?.label || "";
              } else if (filterKey === "penalty_reason_id" && filterOptions.penaltyReasons) {
                label = "Motivo";
                const reason = filterOptions.penaltyReasons.find(r => r.value.toString() === filters.penalty_reason_id?.toString());
                value = reason?.label || "";
              } else if (filterKey === "date_start") {
                label = "Desde";
                value = formatDate(filters.date_start);
              } else if (filterKey === "date_end") {
                label = "Hasta";
                value = formatDate(filters.date_end);
              } else if (filterKey === "document_id" && filterOptions.documents) {
                label = "Documento";
                const doc = filterOptions.documents.find(d => d.value.toString() === filters.document_id?.toString());
                value = doc?.label || "";
              } else if (filterKey === "employee_id" && filterOptions.operators) {
                label = "Operario";
                const operator = filterOptions.operators.find(o => o.value.toString() === filters.employee_id?.toString());
                value = operator?.label || "";
              }

              if (!value) return null;

              return (
                <Badge 
                  key={filterKey}
                  variant="outline" 
                  className="flex items-center gap-1 pl-2 pr-1 py-1 h-7"
                >
                  <span className="text-xs font-semibold">{label}:</span> 
                  <span className="text-xs">{value}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearFilter(filterKey)}
                    className="h-5 w-5 p-0 ml-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
            
            {activeFilterCount > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Limpiar todos
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FilterBar;
