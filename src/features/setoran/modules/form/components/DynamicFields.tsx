import { Input } from "@/components/ui/input";
import {
  FormControl,
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
import { Checkbox } from "@/components/ui/checkbox";

interface DynamicFieldsProps {
  form: any;
  customFields: any[];
}

export function DynamicFields({ form, customFields }: DynamicFieldsProps) {
  if (customFields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {customFields.map((field) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`custom_values.${field.id}` as any}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                {field.type === "text" ? (
                  <Input
                    placeholder={`Masukkan ${field.label}...`}
                    {...formField}
                    value={formField.value ?? ""}
                  />
                ) : field.type === "number" ? (
                  <Input
                    type="number"
                    placeholder="0"
                    {...formField}
                    value={formField.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      formField.onChange(val === "" ? "" : Number(val));
                    }}
                  />
                ) : field.type === "select" ? (
                  <Select
                    onValueChange={formField.onChange}
                    value={formField.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt: string) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "boolean" ? (
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={field.id}
                      checked={formField.value === true}
                      onCheckedChange={formField.onChange}
                    />
                    <label
                      htmlFor={field.id}
                      className="text-xs font-normal text-muted-foreground cursor-pointer select-none"
                    >
                      Ya / Tidak
                    </label>
                  </div>
                ) : null}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}