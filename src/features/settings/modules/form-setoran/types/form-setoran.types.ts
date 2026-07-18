export interface CustomField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  required: boolean;
  options?: string[];
  defaultValue?: any;
}
