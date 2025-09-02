import { useParams } from "react-router-dom";
import Driver from "../db/Driver";
import { getImage } from "../assets/images";

export default function () {
  const { id } = useParams<{ id: string }>();
  const driver = Driver.find(id!);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        {driver?.image && (
          <img
            src={getImage(driver.image)}
            alt={driver.name}
            className="w-24 h-24 object-cover"
          />
        )}

        <h1>{driver?.fullname()}</h1>
      </div>
    </>
  );
}
