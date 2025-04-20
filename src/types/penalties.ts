export interface Penalty {
    id: number;
    penalty_date: Date;
    identifier: string;
    ocurrency_date: Date;
    days_quantity: number;
    until_date: Date;
    cause: string;
    employee_discharge: string;
    penalty_type_id: number;
    penalty_reason_id: number;
    project_id: number;
    employee_id: number;
    responsible_id: number;
    document_attachments: DocumentAttachments[];
    triggers_temporary_state: boolean;
    temporary_state_id: number;
}

export interface DocumentAttachments { id: number; file_url: string; name: string };

export interface PenaltyFilteringParams {
    project_id: number;
    penalty_type_id: number;
    search: string;
    penalty_employee_id: number;
    date_start: Date;
    date_end: Date;
    penalty_reason_id: number;
    page: number;
}