import { DocumentAttachments, Penalty, PenaltyFilteringParams } from '@/types/penalties';

export enum PenaltyType {
  SUSPENSION = 1,
  ORAL_OBSERVATION = 2,
  WRITTEN_OBSERVATION = 3,
  DISMISSAL = 4
}

const mockPenalties: Penalty[] = [
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

// Update penalty types mapping to match the 4 required types
const penaltyTypeNames: Record<number, string> = {
  [PenaltyType.SUSPENSION]: 'Suspensión',
  [PenaltyType.ORAL_OBSERVATION]: 'Observación oral',
  [PenaltyType.WRITTEN_OBSERVATION]: 'Observación escrita',
  [PenaltyType.DISMISSAL]: 'Despido'
};

// Mock projects mapping
const projectNames: Record<number, string> = {
  1: 'Proyecto Alpha',
  2: 'Proyecto Beta',
  3: 'Proyecto Gamma',
};

// Mock employees mapping
const employeeNames: Record<number, string> = {
  101: 'Juan Pérez',
  118: 'María Rodríguez',
  143: 'Carlos Gómez',
  195: 'Ana Martínez',
  205: 'Roberto Sánchez',
};

// Mock penalty reasons
const penaltyReasonNames: Record<number, string> = {
  1: 'Retraso',
  2: 'Ausencia injustificada',
  3: 'Incumplimiento de horario',
  4: 'Daño a equipamiento',
  5: 'Incumplimiento normativo',
  6: 'Conducta inapropiada',
  7: 'Comportamiento inadecuado',
  8: 'Uso indebido de recursos',
};

export const PenaltyService = {
  getPenalties: async (filters?: Partial<PenaltyFilteringParams>): Promise<Penalty[]> => {
    let result = [...mockPenalties];
    
    if (filters) {
      if (filters.project_id) {
        result = result.filter(p => p.project_id === filters.project_id);
      }
      
      if (filters.penalty_type_id) {
        result = result.filter(p => p.penalty_type_id === filters.penalty_type_id);
      }
      
      if (filters.penalty_employee_id) {
        result = result.filter(p => p.employee_id === filters.penalty_employee_id);
      }
      
      if (filters.penalty_reason_id) {
        result = result.filter(p => p.penalty_reason_id === filters.penalty_reason_id);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(p => 
          p.identifier.toLowerCase().includes(searchTerm) || 
          p.cause.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.date_start) {
        result = result.filter(p => p.penalty_date >= (filters?.date_start || new Date(0)));
      }
      
      if (filters.date_end) {
        result = result.filter(p => p.penalty_date <= (filters?.date_end || new Date()));
      }
    }
    
    return result;
  },
  
  getPenaltyById: async (id: number): Promise<Penalty | undefined> => {
    return mockPenalties.find(p => p.id === id);
  },
  
  getPenaltyTypeName: (typeId: number): string => {
    return penaltyTypeNames[typeId] || 'Desconocido';
  },

  getProjectName: (projectId: number): string => {
    return projectNames[projectId] || 'Desconocido';
  },

  getEmployeeName: (employeeId: number): string => {
    return employeeNames[employeeId] || 'Desconocido';
  },

  getPenaltyReasonName: (reasonId: number): string => {
    return penaltyReasonNames[reasonId] || 'Desconocido';
  },

  getProjectOptions: () => {
    return Object.entries(projectNames).map(([id, name]) => ({
      value: parseInt(id),
      label: name
    }));
  },

  // Get all penalty types as options for filters
  getPenaltyTypeOptions: () => {
    return Object.entries(penaltyTypeNames).map(([id, name]) => ({
      value: parseInt(id),
      label: name
    }));
  },

  // Get all penalty reasons as options for filters
  getPenaltyReasonOptions: () => {
    return Object.entries(penaltyReasonNames).map(([id, name]) => ({
      value: parseInt(id),
      label: name
    }));
  },

  // Get all employees as options for filters
  getEmployeeOptions: () => {
    return Object.entries(employeeNames).map(([id, name]) => ({
      value: parseInt(id),
      label: name
    }));
  },

  // Delete a penalty
  deletePenalty: async (id: number): Promise<boolean> => {
    try {
      const penaltyIndex = mockPenalties.findIndex(p => p.id === id);
      if (penaltyIndex === -1) {
        return false;
      }
      
      mockPenalties.splice(penaltyIndex, 1);
      return true;
    } catch (error) {
      console.error("Error deleting penalty:", error);
      return false;
    }
  },

  // Create a new penalty
  createPenalty: async (penalty: Partial<Penalty>): Promise<Penalty> => {
    // For now, use mock data
    const newPenalty: Penalty = {
      id: Math.max(...mockPenalties.map(p => p.id)) + 1,
      identifier: penalty.identifier || `SAN-${new Date().getFullYear()}-${(Math.floor(Math.random() * 900) + 100)}`,
      penalty_date: new Date(penalty.penalty_date || new Date()),
      ocurrency_date: new Date(penalty.ocurrency_date || new Date()),
      days_quantity: penalty.days_quantity || 0,
      until_date: new Date(penalty.until_date || new Date()),
      cause: penalty.cause || '',
      employee_discharge: penalty.employee_discharge || '',
      penalty_type_id: penalty.penalty_type_id || 1,
      penalty_reason_id: penalty.penalty_reason_id || 1,
      project_id: penalty.project_id || 1,
      employee_id: penalty.employee_id || 1,
      responsible_id: penalty.responsible_id || 1,
      document_attachments: penalty.document_attachments as DocumentAttachments[] || [],
      triggers_temporary_state: penalty.triggers_temporary_state || false,
      temporary_state_id: penalty.temporary_state_id || 0
    };
    
    mockPenalties.unshift(newPenalty);
    return newPenalty;
  },
  
  // Update an existing penalty
  updatePenalty: async (id: number, penalty: Partial<Penalty>): Promise<Penalty | undefined> => {

    const index = mockPenalties.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    const updatedPenalty: Penalty = {
      ...mockPenalties[index],
      ...penalty,
      penalty_date: new Date(penalty.penalty_date || mockPenalties[index].penalty_date),
      ocurrency_date: new Date(penalty.ocurrency_date || mockPenalties[index].ocurrency_date),
      until_date: new Date(penalty.until_date || mockPenalties[index].until_date),
      document_attachments: penalty.document_attachments as DocumentAttachments[] || mockPenalties[index].document_attachments
    };
    
    mockPenalties[index] = updatedPenalty;
    return updatedPenalty;
  }
};
