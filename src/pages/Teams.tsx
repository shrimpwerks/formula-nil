import { Heading } from "../components/heading";
import { Table, TableCell, TableRow } from "../components/table";
import { Text } from "../components/text";
import Team from "../db/Team";

export default function Teams() {
  return (
    <>
      <Heading>Teams</Heading>

      <Table>
        {Team.all().map((team) => (
          <TableRow href={`/team/${team.id}`}>
            <TableCell>
              <Text>{team.name}</Text>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
