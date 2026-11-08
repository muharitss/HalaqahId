export interface TerminologyConfigItem {
  code: string;
  defaultLabel: string;
  description: string;
  placeholder: string;
  category?: string;
  quickOptions?: string[];
}

export interface TerminologyState {
  customLabels: Record<string, string>;
  savingKey: string | null;
  isSavingAll: boolean;
}
