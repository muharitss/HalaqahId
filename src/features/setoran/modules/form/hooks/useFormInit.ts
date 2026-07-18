import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SetoranFormFields } from "../../../types";
import { FORM_DEFAULTS, TEMP_STORAGE_KEY } from "../constants/form.constants";
import { useDynamicSchema } from "./useDynamicSchema";

export function useFormInit(customFields: any[]) {
  const { schema } = useDynamicSchema();

  const tempDefaults = useMemo(() => {
    try {
      const stored = localStorage.getItem(TEMP_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data && Date.now() - data.timestamp < 10 * 60 * 1000) {
          return {
            id_santri: data.id_santri || undefined,
            id_sesi: data.id_sesi || undefined,
            id_kategori: data.id_kategori || undefined,
          };
        }
      }
    } catch {
      // ignore
    }
    return {};
  }, []);

  const form = useForm<SetoranFormFields>({
    resolver: zodResolver(schema) as Resolver<SetoranFormFields>,
    defaultValues: {
      ...FORM_DEFAULTS,
      id_santri: tempDefaults.id_santri ?? FORM_DEFAULTS.id_santri,
      id_sesi: tempDefaults.id_sesi ?? FORM_DEFAULTS.id_sesi,
      id_kategori: tempDefaults.id_kategori ?? FORM_DEFAULTS.id_kategori,
    },
  });

  // Init custom_values defaults
  useEffect(() => {
    if (customFields.length > 0) {
      const currentValues = form.getValues("custom_values") || {};
      const newCustomValues = { ...currentValues };
      customFields.forEach((field) => {
        if (newCustomValues[field.id] === undefined) {
          newCustomValues[field.id] =
            field.defaultValue !== undefined
              ? field.defaultValue
              : field.type === "boolean"
                ? false
                : "";
        }
      });
      form.setValue("custom_values", newCustomValues);
    }
  }, [customFields, form]);

  return { form, schema, tempDefaults };
}
