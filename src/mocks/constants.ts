export enum PenaltyType {
  SUSPENSION = 1,
  ORAL_OBSERVATION = 2,
  WRITTEN_OBSERVATION = 3,
  DISMISSAL = 4
}

// Penalty types mapping to match the 4 required types
export const penaltyTypeNames: Record<number, string> = {
  [PenaltyType.SUSPENSION]: 'Suspensión',
  [PenaltyType.ORAL_OBSERVATION]: 'Observación oral',
  [PenaltyType.WRITTEN_OBSERVATION]: 'Observación escrita',
  [PenaltyType.DISMISSAL]: 'Despido'
};

// Projects mapping
export const projectNames: Record<number, string> = {
  1: 'Proyecto Alpha',
  2: 'Proyecto Beta',
  3: 'Proyecto Gamma',
};

// Employees mapping
export const employeeNames: Record<number, string> = {
  101: 'Juan Pérez',
  118: 'María Rodríguez',
  143: 'Carlos Gómez',
  195: 'Ana Martínez',
  205: 'Roberto Sánchez',
};

// Penalty reasons mapping
export const penaltyReasonNames: Record<number, string> = {
  1: 'Retraso',
  2: 'Ausencia injustificada',
  3: 'Incumplimiento de horario',
  4: 'Daño a equipamiento',
  5: 'Incumplimiento normativo',
  6: 'Conducta inapropiada',
  7: 'Comportamiento inadecuado',
  8: 'Uso indebido de recursos',
};
