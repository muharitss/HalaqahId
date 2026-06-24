import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faUsers, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export function SuperadminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Superadmin Dashboard</h1>
        <p className="text-muted-foreground">
          Kelola semua tenant sekolah dan administrator di Halaqah.id
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sekolah</CardTitle>
            <FontAwesomeIcon icon={faSchool} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mock Data</div>
            <p className="text-xs text-muted-foreground">Tenant aktif di sistem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
            <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mock Data</div>
            <p className="text-xs text-muted-foreground">Admin lintas sekolah</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mock Data</div>
            <p className="text-xs text-muted-foreground">Seluruh pengguna (Muhafiz & Admin)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
