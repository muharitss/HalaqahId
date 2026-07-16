import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { buildDynamicSchema } from "../validation/setoran.schema";

export function useDynamicSchema() {
  const { data: profileData } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: () => sekolahService.getProfile(),
  });

  const customFields = useMemo(() => {
    return (profileData?.data?.form_setoran_config as any[]) || [];
  }, [profileData]);

  const schema = useMemo(() => buildDynamicSchema(customFields), [customFields]);

  return { schema, customFields };
}