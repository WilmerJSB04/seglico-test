import { DocumentAttachments, Penalty, PenaltyFilteringParams } from '@/types/penalties';
import { PenaltyType, penaltyTypeNames, projectNames, employeeNames, penaltyReasonNames } from '@/mocks/constants';
import { mockPenalties } from '@/mocks/penalties';

// Re-export PenaltyType enum for other modules to use
export { PenaltyType };

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
