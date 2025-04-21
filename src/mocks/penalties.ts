import { Penalty } from "@/types/penalties";
import { PenaltyType } from "./constants";

export const mockPenalties: Penalty[] = [
  {
    id: 1,
    penalty_date: new Date('2025-04-10'),
    identifier: 'SAN-2025-001',
    ocurrency_date: new Date('2025-04-08'),
    days_quantity: 3,
    until_date: new Date('2025-04-13'),
    cause: 'Incumplimiento de horario laboral',
    employee_discharge: 'El empleado reconoce la falta',
    penalty_type_id: PenaltyType.SUSPENSION,
    penalty_reason_id: 3,
    project_id: 2,
    employee_id: 101,
    responsible_id: 45,
    document_attachments: [
      { id: 1, file_url: '/documents/penalty-1-evidence.pdf', name: 'Evidencia.pdf' }
    ],
    triggers_temporary_state: true,
    temporary_state_id: 2
  },
  {
    id: 2,
    penalty_date: new Date('2025-04-05'),
    identifier: 'SAN-2025-002',
    ocurrency_date: new Date('2025-04-04'),
    days_quantity: 1,
    until_date: new Date('2025-04-06'),
    cause: 'Incumplimiento de normativa de seguridad',
    employee_discharge: 'Alega desconocimiento de la norma',
    penalty_type_id: PenaltyType.ORAL_OBSERVATION,
    penalty_reason_id: 5,
    project_id: 1,
    employee_id: 205,
    responsible_id: 45,
    document_attachments: [
      { id: 2, file_url: '/documents/penalty-2-report.pdf', name: 'Reporte.pdf' },
      { id: 3, file_url: '/documents/penalty-2-photo.jpg', name: 'Fotografía.jpg' }
    ],
    triggers_temporary_state: false,
    temporary_state_id: 0
  },
  {
    id: 3,
    penalty_date: new Date('2025-04-12'),
    identifier: 'SAN-2025-003',
    ocurrency_date: new Date('2025-04-11'),
    days_quantity: 5,
    until_date: new Date('2025-04-17'),
    cause: 'Ausencia injustificada',
    employee_discharge: 'No presentó justificación',
    penalty_type_id: PenaltyType.SUSPENSION,
    penalty_reason_id: 2,
    project_id: 3,
    employee_id: 143,
    responsible_id: 67,
    document_attachments: [],
    triggers_temporary_state: true,
    temporary_state_id: 1
  },
  {
    id: 4,
    penalty_date: new Date('2025-04-01'),
    identifier: 'SAN-2025-004',
    ocurrency_date: new Date('2025-03-30'),
    days_quantity: 2,
    until_date: new Date('2025-04-03'),
    cause: 'Comportamiento inadecuado',
    employee_discharge: 'Acepta la sanción',
    penalty_type_id: PenaltyType.WRITTEN_OBSERVATION,
    penalty_reason_id: 7,
    project_id: 2,
    employee_id: 118,
    responsible_id: 45,
    document_attachments: [
      { id: 4, file_url: '/documents/penalty-4-witness.pdf', name: 'Testimonio.pdf' }
    ],
    triggers_temporary_state: false,
    temporary_state_id: 0
  },
  {
    id: 5,
    penalty_date: new Date('2025-04-15'),
    identifier: 'SAN-2025-005',
    ocurrency_date: new Date('2025-04-14'),
    days_quantity: 1,
    until_date: new Date('2025-04-16'),
    cause: 'Daño a equipamiento',
    employee_discharge: 'Declara que fue accidental',
    penalty_type_id: PenaltyType.ORAL_OBSERVATION,
    penalty_reason_id: 4,
    project_id: 1,
    employee_id: 195,
    responsible_id: 67,
    document_attachments: [
      { id: 5, file_url: '/documents/penalty-5-damage-report.pdf', name: 'Informe_Daños.pdf' },
      { id: 6, file_url: '/documents/penalty-5-images.zip', name: 'Imágenes.zip' }
    ],
    triggers_temporary_state: false,
    temporary_state_id: 0
  },
];
