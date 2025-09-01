import { useParams } from "react-router-dom";
import { Heading } from "../components/heading";
import { Table, TableCell, TableRow } from "../components/table";
import { Text } from "../components/text";
import Driver from "../db/Driver";
import Team from "../db/Team";
import { getImage } from "../assets/images";

export default function () {
  const { id } = useParams<{ id: string }>();
  const team = Team.find(id!);

  return (
    <>
      <Heading>{team?.name}</Heading>
      <Heading level={2}>{team?.tagline}</Heading>

      <Heading level={2}>Drivers</Heading>
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
              <Text>
                {driver.name} {driver.surname}
              </Text>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
