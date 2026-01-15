import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEdit, faTrash, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SantriTable({ data, searchTerm, isAdmin, halaqahList, onEdit, onDelete }: any) {
  
  const renderTargetBadge = (target: string) => {
    switch (target) {
      case "RINGAN":
        return <Badge variant="secondary">RINGAN</Badge>;
      case "SEDANG":
        return <Badge variant="outline">SEDANG</Badge>;
      case "INTENSE":
        return <Badge variant="default">INTENS</Badge>;
      case "CUSTOM_KHUSUS": // Jika ada target khusus
        return <Badge variant="destructive">KHUSUS</Badge>;
      default:
        return <Badge variant="outline">{target}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Santri</CardTitle>
        <CardDescription>
          {data.length} santri ditemukan {searchTerm && `untuk "${searchTerm}"`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Nama Santri</TableHead>
                <TableHead className="font-bold">Nomor Telepon</TableHead>
                <TableHead className="font-bold">Target</TableHead>
                {isAdmin && <TableHead className="font-bold">Halaqah</TableHead>}
                <TableHead className="text-right font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Tidak ada santri yang sesuai dengan pencarian" : "Belum ada data santri"}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((santri: any) => (
                  <TableRow key={santri.id_santri}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{santri.id_santri}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {santri.nama_santri}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-xs text-muted-foreground" />
                        <span className="text-sm">{santri.nomor_telepon}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderTargetBadge(santri.target)}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <span className="text-sm">
                          {halaqahList.find((h: any) => h.id_halaqah === santri.halaqah_id)?.nama_halaqah || `Halaqah ${santri.halaqah_id}`}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FontAwesomeIcon icon={faEllipsisH} className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onEdit(santri)}>
                            <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" /> 
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(santri)} 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" /> 
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}