import Driver from "../db/Driver";
import { getImage } from "../assets/images";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function () {
  const navigate = useNavigate();

  return (
    <>
      <h1>Drivers</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Driver.all().map((driver) => (
            <TableRow onClick={() => navigate(`/driver/${driver.id}`)}>
              <TableCell className="flex items-center gap-3">
                {driver.image && (
                  <img
                    src={getImage(driver.image)}
                    alt={driver.name}
                    className="w-10 h-10"
                  />
                )}
                {driver.name} {driver.surname}
              </TableCell>
              <TableCell>TODO</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
