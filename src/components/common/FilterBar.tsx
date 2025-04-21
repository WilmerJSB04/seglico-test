"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

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

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterBarProps {
  filterTypes: FilterType[];
  initialFilters?: Record<string, any>;
  filterOptions?: {
    projects?: FilterOption[];
    penaltyTypes?: FilterOption[];
    penaltyReasons?: FilterOption[];
    documents?: FilterOption[];
    operators?: FilterOption[];
  };
  onFiltersChange: (filters: Record<string, any>) => void;
  // Optional placeholder text for search
  searchPlaceholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterTypes,
  initialFilters = {},
  filterOptions = {},
  onFiltersChange,
  searchPlaceholder = "Buscar...",
}) => {
  // Reference to track if this is the initial render
  const isInitialMount = useRef(true);

  // Clean initialFilters by removing undefined/null/empty values
  const cleanedInitialFilters = Object.entries(initialFilters).reduce(
    (acc, [key, value]) => {
      // Only include non-empty values
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );

  const [filters, setFilters] = useState<Record<string, any>>(
    cleanedInitialFilters
  );
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.date_start && filters.date_end
      ? {
          from: new Date(filters.date_start),
          to: new Date(filters.date_end),
        }
      : undefined
  );

  // Calculate active filters separately from the effect
  const calculateActiveFilters = (currentFilters: Record<string, any>) => {
    return Object.entries(currentFilters)
      .filter(([key, value]) => {
        // Special case for 'page' - we don't consider it an active filter
        if (key === "page") return false;

        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
      .map(([key]) => key as FilterType);
  };

  // Update active filters whenever filters change
  useEffect(() => {
    const active = calculateActiveFilters(filters);
    setActiveFilters(active);

    // Only notify parent of filter changes after initial mount
    // This prevents the infinite loop of renders
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      onFiltersChange(filters);
    }
  }, [filters]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: value === "" ? undefined : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (value: string, filterKey: string) => {
    if (value === "all") {
      // Clear the filter by setting it to undefined
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[filterKey]; // Remove the key entirely
        return newFilters;
      });
    } else {
      // Try to convert to number if it's a numeric value
      const numValue = Number(value);
      const finalValue = !isNaN(numValue) ? numValue : value;
      setFilters((prev) => ({ ...prev, [filterKey]: finalValue }));
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range) {
      // Clear both date values
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.date_start;
        delete newFilters.date_end;
        return newFilters;
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        date_start: range.from,
        date_end: range.to,
      }));
    }
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy", { locale: es });
  };

  // Clear a specific filter
  const clearFilter = (filterKey: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // Special handling for date range
      if (filterKey === "date_start" || filterKey === "date_end") {
        // Clear both date values and date range
        delete newFilters.date_start;
        delete newFilters.date_end;
        setDateRange(undefined);
      } else {
        // Remove the specific filter
        delete newFilters[filterKey];
      }

      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const page = filters.page;
    setFilters(page ? { page } : {});
    setDateRange(undefined);
  };

  const activeFilterCount = activeFilters.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {filterTypes.includes("search") && (
          <div className="flex items-center space-x-2 min-w-[200px] max-w-sm flex-grow relative">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="w-full pr-10"
            />
            <Search className="h-4 w-4 absolute right-3 text-muted-foreground" /> 
          </div>
        )}

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
                  <SelectItem
                    key={project.value}
                    value={project.value.toString()}
                  >
                    {project.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {filterTypes.includes("penalty_type") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.penalty_type_id?.toString() || "all"}
              onValueChange={(value) =>
                handleSelectChange(value, "penalty_type_id")
              }
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

        {filterTypes.includes("penalty_reason") && (
          <div className="min-w-[200px]">
            <Select
              value={filters.penalty_reason_id?.toString() || "all"}
              onValueChange={(value) =>
                handleSelectChange(value, "penalty_reason_id")
              }
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

        {/* Date Range filter */}
        {filterTypes.includes("date_range") && (
          <div className="min-w-[240px]">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Rango de fechas"
              align="start"
              className="w-full"
            />
          </div>
        )}

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
                  <SelectItem
                    key={operator.value}
                    value={operator.value.toString()}
                  >
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
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
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
                  <p className="text-sm text-muted-foreground">
                    No hay filtros aplicados
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filters.search && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Búsqueda: {filters.search}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter("search")}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {filters.project_id && filterOptions.projects && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Proyecto:{" "}
                          {
                            filterOptions.projects.find(
                              (p) =>
                                p.value.toString() ===
                                filters.project_id?.toString()
                            )?.label
                          }
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter("project_id")}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {filters.penalty_type_id && filterOptions.penaltyTypes && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Tipo:{" "}
                          {
                            filterOptions.penaltyTypes.find(
                              (t) =>
                                t.value.toString() ===
                                filters.penalty_type_id?.toString()
                            )?.label
                          }
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter("penalty_type_id")}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {(filters.date_start || filters.date_end) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {filters.date_start && filters.date_end
                            ? `Rango de fechas: ${formatDate(
                                filters.date_start
                              )} - ${formatDate(filters.date_end)}`
                            : filters.date_start
                            ? `Fecha desde: ${formatDate(filters.date_start)}`
                            : `Fecha hasta: ${formatDate(filters.date_end)}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDateRange(undefined);
                            clearFilter("date_start");
                            clearFilter("date_end");
                          }}
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
            {activeFilters.map((filterKey) => {
              let label = "";
              let value = "";

              // Generate label and value based on filter key
              if (filterKey === "search") {
                label = "Búsqueda";
                value = filters.search;
              } else if (
                filterKey === "project_id" &&
                filterOptions.projects
              ) {
                label = "Proyecto";
                const project = filterOptions.projects.find(
                  (p) =>
                    p.value.toString() === filters.project_id?.toString()
                );
                value = project?.label || "";
              } else if (
                filterKey === "penalty_type_id" &&
                filterOptions.penaltyTypes
              ) {
                label = "Tipo";
                const type = filterOptions.penaltyTypes.find(
                  (t) =>
                    t.value.toString() === filters.penalty_type_id?.toString()
                );
                value = type?.label || "";
              } else if (
                filterKey === "penalty_reason_id" &&
                filterOptions.penaltyReasons
              ) {
                label = "Motivo";
                const reason = filterOptions.penaltyReasons.find(
                  (r) =>
                    r.value.toString() === filters.penalty_reason_id?.toString()
                );
                value = reason?.label || "";
              } else if (filterKey === "date_start" && filters.date_end) {
                label = "Rango";
                value = `${formatDate(filters.date_start)} - ${formatDate(
                  filters.date_end
                )}`;
              } else if (filterKey === "date_start") {
                label = "Desde";
                value = formatDate(filters.date_start);
              } else if (filterKey === "date_end") {
                label = "Hasta";
                value = formatDate(filters.date_end);
              } else if (
                filterKey === "document_id" &&
                filterOptions.documents
              ) {
                label = "Documento";
                const doc = filterOptions.documents.find(
                  (d) =>
                    d.value.toString() === filters.document_id?.toString()
                );
                value = doc?.label || "";
              } else if (
                filterKey === "employee_id" &&
                filterOptions.operators
              ) {
                label = "Operario";
                const operator = filterOptions.operators.find(
                  (o) =>
                    o.value.toString() === filters.employee_id?.toString()
                );
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
