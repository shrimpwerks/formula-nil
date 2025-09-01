import { Heading } from "../components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { Text } from "../components/text";
import Driver from "../db/Driver";

export default function () {
  return (
    <>
      <Heading>Drivers</Heading>

      <Table>
        <TableHead>
          <TableHeader>Name</TableHeader>
          <TableHeader>Team</TableHeader>
        </TableHead>
        <TableBody>
          {Driver.all().map((driver) => (
            <TableRow href={`/formula-nil/#/driver/${driver.id}`}>
              <TableCell className="flex items-center gap-3">
                {driver.image && (
                  <img
                    src={`/formula-nil/images/${driver.image}`}
                    alt={driver.name}
                    className="w-12 h-12 object-cover"
                  />
                )}
                <Text>
                  {driver.name} {driver.surname}
                </Text>
              </TableCell>
              <TableCell>
                <Text>TODO</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
