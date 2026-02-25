import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import type { Muhafiz } from "@/services/akunService";

interface MuhafizTableProps {
  data: Muhafiz[];
  loading: boolean;
}

export const MuhafizTable = ({ data, loading }: MuhafizTableProps) => {
  return (
    <Card className="shadow-none border-none bg-card/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 py-4 px-6">
        <CardTitle className="text-base font-semibold">Muhafidz Baru Terdaftar</CardTitle>
        <Button variant="link" size="sm" asChild className="text-primary">
          <Link to="/kepala-muhafidz/muhafiz">
            Lihat Semua <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/5">
            <TableRow>
              <TableHead className="pl-6">ID</TableHead>
              <TableHead>Nama Muhafidz</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-right pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Belum ada muhafidz.
                </TableCell>
              </TableRow>
            ) : (
              data.slice(0, 5).map((m) => (
                <TableRow key={m.id_user} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="pl-6">
                    <Badge variant="outline" className="border-primary/20 font-mono group-hover:bg-primary group-hover:text-white transition-colors">
                      #{m.id_user}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{m.username}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{m.email}</TableCell>
                  <TableCell className="text-right pr-6 font-medium text-primary text-sm">● Aktif</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};