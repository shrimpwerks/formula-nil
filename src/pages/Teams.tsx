import { Text } from '../components/text';
import Team from "../db/Team";

export default function Teams() {
  return (
    <div>
      <h1>Teams</h1>

      <ul>
        {Team.all().map((team) => (
          <li key={team.id}><Text>{team.name}</Text></li>
        ))}
      </ul>
    </div>
  );
}
