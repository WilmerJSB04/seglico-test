"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Penalty } from "@/types/penalties";
import { PenaltyService, PenaltyType } from "@/services/penalty";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft } from "lucide-react";

// Schema for form validation
const penaltyFormSchema = z.object({
  identifier: z.string().min(1, "El identificador es obligatorio"),
  penalty_date: z.date({
    required_error: "La fecha de sanción es obligatoria",
  }),
  ocurrency_date: z.date({
    required_error: "La fecha de ocurrencia es obligatoria",
  }),
  days_quantity: z.number().min(0, "Los días deben ser un número positivo").optional(),
  until_date: z.date().optional(),
  cause: z.string().min(1, "La causa es obligatoria"),
  employee_discharge: z.string().optional(),
  penalty_type_id: z.number({
    required_error: "El tipo de sanción es obligatorio",
  }),
  penalty_reason_id: z.number({
    required_error: "El motivo de sanción es obligatorio",
  }),
  project_id: z.number({
    required_error: "El proyecto es obligatorio",
  }),
  employee_id: z.number({
    required_error: "El operario es obligatorio",
  }),
  document_attachments: z.array(z.any()).optional(),
  triggers_temporary_state: z.boolean().default(false),
  temporary_state_id: z.number().optional(),
});

type PenaltyFormValues = z.infer<typeof penaltyFormSchema>;

export interface PenaltyFormProps {
  penalty?: Penalty;
  isEdit?: boolean;
}

export function PenaltyForm({ penalty, isEdit = false }: PenaltyFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const form = useForm({
    resolver: zodResolver(penaltyFormSchema),
    defaultValues: penalty
      ? {
          ...penalty,
          penalty_date: new Date(penalty.penalty_date),
          ocurrency_date: new Date(penalty.ocurrency_date),
          until_date: penalty.until_date ? new Date(penalty.until_date) : undefined,
          days_quantity: penalty.days_quantity || 0,
        }
      : {
          penalty_date: new Date(),
          ocurrency_date: new Date(),
          days_quantity: 0,
          triggers_temporary_state: false,
        },
  });

  // Update date range when days are changed
  useEffect(() => {
    const startDate = form.getValues("penalty_date");
    const daysQuantity = form.getValues("days_quantity");
    
    if (startDate && daysQuantity) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + daysQuantity);
      
      form.setValue("until_date", endDate);
      setDateRange({ 
        from: startDate,
        to: endDate 
      });
    }
  }, [form.watch("penalty_date"), form.watch("days_quantity")]);

  // Initialize dateRange if editing
  useEffect(() => {
    if (isEdit && penalty) {
      setDateRange({
        from: new Date(penalty.penalty_date),
        to: new Date(penalty.until_date),
      });
    }
  }, [isEdit, penalty]);

  const onSubmit = async (data: PenaltyFormValues) => {
    setLoading(true);
    try {
      if (isEdit && penalty) {
        // Update existing penalty
        await PenaltyService.updatePenalty(penalty.id, data);
        toast({
          title: "Sanción actualizada",
          description: "La sanción ha sido actualizada correctamente",
          variant: "default",
        });
      } else {
        // Create new penalty
        await PenaltyService.createPenalty(data);
        toast({
          title: "Sanción creada",
          description: "La sanción ha sido creada correctamente",
          variant: "default",
        });
      }
      
      // Add a 2-second delay before redirecting
      setTimeout(() => {
        // Redirect back to the penalties list
        navigate("/penalties");
      }, 2000);
      
    } catch (error) {
      console.error("Error saving penalty:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la sanción",
        variant: "destructive",
      });
      setLoading(false); // Only set loading to false on error
    }
    // Don't set loading to false here, as we're keeping the button disabled during the delay
  };

  // Function to handle days quantity change and update until date
  const handleDaysChange = (value: number) => {
    form.setValue("days_quantity", value);
    
    const startDate = form.getValues("penalty_date");
    if (startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + value);
      form.setValue("until_date", endDate);
    }
  };

  // Handle penalty date change
  const handlePenaltyDateChange = (date: Date | undefined) => {
    if (date) {
      form.setValue("penalty_date", date);
      
      const daysQuantity = form.getValues("days_quantity") || 0;
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + daysQuantity);
      form.setValue("until_date", endDate);
    }
  };

  // Handle penalty type change
  const handlePenaltyTypeChange = (value: string) => {
    const penaltyTypeId = parseInt(value);
    form.setValue("penalty_type_id", penaltyTypeId);
    
    // If not suspension, clear days quantity and until date
    if (penaltyTypeId !== PenaltyType.SUSPENSION) {
      form.setValue("days_quantity", 0);
      form.setValue("until_date", undefined);
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center">
            <Button 
            variant="outline" 
            onClick={() => navigate("/penalties")}
            className="mr-4"
            >
            <ArrowLeft className="h-4 w-4 mr-2" />
             Volver
            </Button>
            <h1 className="text-2xl font-bold">
            {isEdit ? "Editar sanción" : "Nueva sanción"}
            </h1>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Identificador</FormLabel>
                        <FormControl>
                            <Input placeholder="SAN-2025-001" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="penalty_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col mt-2">
                        <FormLabel>Fecha de sanción</FormLabel>
                        <DatePicker
                            selected={field.value}
                            onSelect={handlePenaltyDateChange}
                            disabled={loading}
                            className="w-full"
                        />
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="employee_id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Operario</FormLabel>
                        <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            disabled={loading}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un operario" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {PenaltyService.getEmployeeOptions().map((employee) => (
                                <SelectItem
                                key={employee.value}
                                value={employee.value.toString()}
                                >
                                {employee.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Proyecto</FormLabel>
                        <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            disabled={loading}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un proyecto" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {PenaltyService.getProjectOptions().map((project) => (
                                <SelectItem
                                key={project.value}
                                value={project.value.toString()}
                                >
                                {project.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="ocurrency_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col mt-2">
                        <FormLabel>Fecha de ocurrencia</FormLabel>
                        <DatePicker
                            selected={field.value}
                            onSelect={(date) => date && field.onChange(date)}
                            disabled={loading}
                            className="w-full"
                        />
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Detalles de la sanción</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <FormField
                    control={form.control}
                    name="penalty_type_id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de sanción</FormLabel>
                        <Select
                            value={field.value?.toString()}
                            onValueChange={handlePenaltyTypeChange}
                            disabled={loading}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {PenaltyService.getPenaltyTypeOptions().map((type) => (
                                <SelectItem
                                key={type.value}
                                value={type.value.toString()}
                                >
                                {type.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="penalty_reason_id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Motivo de sanción</FormLabel>
                        <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            disabled={loading}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un motivo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {PenaltyService.getPenaltyReasonOptions().map((reason) => (
                                <SelectItem
                                key={reason.value}
                                value={reason.value.toString()}
                                >
                                {reason.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="cause"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                        <FormLabel>Causa</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Descripción detallada de la causa"
                            {...field}
                            rows={3}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="employee_discharge"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                        <FormLabel>Descargo del empleado</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Descargo o respuesta del empleado"
                            {...field}
                            rows={3}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </CardContent>
            </Card>

            {form.watch("penalty_type_id") === PenaltyType.SUSPENSION && (
                <Card>
                <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-4">Detalles de la suspensión</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <FormField
                        control={form.control}
                        name="days_quantity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Días de suspensión</FormLabel>
                            <FormControl>
                            <Input 
                                type="number" 
                                min="0"
                                {...field}
                                onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="until_date"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha hasta</FormLabel>
                            <FormControl>
                            <Input 
                                value={field.value ? format(field.value, 'dd/MM/yyyy', { locale: es }) : ''} 
                                disabled 
                            />
                            </FormControl>
                            <FormDescription>
                            Esta fecha se calcula automáticamente
                            </FormDescription>
                        </FormItem>
                        )}
                    />

                    {/* Date Range Visual Component */}
                    <div className="col-span-2">
                        <FormLabel>Rango de fechas</FormLabel>
                        <DateRangePicker
                        value={dateRange}
                        onChange={(range) => setDateRange(range)}
                        className="w-full"
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="triggers_temporary_state"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Desencadena estado temporal</FormLabel>
                            <FormDescription>
                            Marcar si esta sanción genera un estado temporal para el empleado
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                    />

                    {form.watch("triggers_temporary_state") && (
                    <FormField
                        control={form.control}
                        name="temporary_state_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado temporal</FormLabel>
                            <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            disabled={loading}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="1">Suspendido</SelectItem>
                                <SelectItem value="2">Amonestado</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    )}
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Documentos adjuntos</h2>
                <FileUploader 
                    onFilesChange={(files) => form.setValue('document_attachments', files)}
                    existingFiles={penalty?.document_attachments || []} 
                />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button 
                variant="outline" 
                onClick={() => navigate("/penalties")}
                disabled={loading}
                >
                Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Guardar cambios" : "Crear sanción"}
                </Button>
            </div>
            </form>
        </Form>  
    </div>
  );
}
