import Team from "../db/Team";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Teams() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Teams</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Team.all().map((team) => (
            <TableRow onClick={() => navigate(`/team/${team.id}`)}>
              <TableCell>{team.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
