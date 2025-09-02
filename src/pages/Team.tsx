import { useParams } from "react-router-dom";
import Driver from "../db/Driver";
import Team from "../db/Team";
import { getImage } from "../assets/images";
import { Table, TableCell, TableRow } from "@/components/ui/table";

export default function () {
  const { id } = useParams<{ id: string }>();
  const team = Team.find(id!);

  return (
    <>
      <h1>{team?.name}</h1>
      <h1>{team?.tagline}</h1>

      <h1>Drivers</h1>
      <Table>
        {Driver.all().map((driver) => (
          <TableRow>
            <TableCell>
              {driver.image && (
                <img
                  src={getImage(driver.image)}
                  alt={driver.name}
                  className="w-12 h-12 object-cover"
                />
              )}
            </TableCell>
            <TableCell>
              {driver.name} {driver.surname}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
