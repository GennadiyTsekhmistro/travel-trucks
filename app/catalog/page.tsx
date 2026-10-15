"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
type Camper = {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  description: string;
  coverImage: string;
  engine: string;
  transmission: string;
  form: string;
};

type CampersResponse = {
  campers: Camper[];
  total: number;
  page: number;
  totalPages: number;
};

export default function Catalog() {
  const [engines, setEngines] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [forms, setForms] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [campers, setCampers] = useState<Camper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchCampers() {
      try {
        const response = await fetch(
          "https://campers-api.goit.study/campers?limit=5&page=1",
        );

        if (!response.ok) {
          throw new Error("Не вдалося завантажити кемпери");
        }

        const data: CampersResponse = await response.json();

        setCampers(data.campers);
      } catch {
        setError("Помилка завантаження кемперів");
      } finally {
        setLoading(false);
      }
    }

    fetchCampers();
  }, []);
  function toggleEngine(value: string) {
    setEngines((current) =>
      current.includes(value)
        ? current.filter((engine) => engine !== value)
        : [...current, value],
    );
  }
  function toggleForm(value: string) {
    setForms((current) =>
      current.includes(value)
        ? current.filter((form) => form !== value)
        : [...current, value],
    );
  }

  function handleSearch() {
    console.log({
      location,
      engines,
      transmissions,
      forms,
    });
  }
  return (
    <main>
      <header>
        <Link href="/">TravelTrucks</Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/catalog">Catalog</Link>
        </nav>
      </header>

      <section>
        <h1>Catalog</h1>

        {loading && <p>Завантаження кемперів...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <div>
            {campers.map((camper) => (
              <article key={camper.id}>
                <Image
                  src={camper.coverImage}
                  alt={camper.name}
                  width={300}
                  height={200}
                  style={{ objectFit: "cover" }}
                />

                <h2>{camper.name}</h2>

                <p>Ціна: €{camper.price}</p>

                <p>Рейтинг: {camper.rating}</p>

                <p>Місце розташування: {camper.location}</p>

                <p>{camper.description}</p>
              </article>
            ))}
          </div>
        )}

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="City"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        <h2>Filters</h2>

        <fieldset>
          <legend>Engine</legend>

          <label>
            <input
              type="checkbox"
              name="engine"
              value="diesel"
              checked={engines.includes("diesel")}
              onChange={() => toggleEngine("diesel")}
            />
            Diesel
          </label>

          <label>
            <input
              type="checkbox"
              name="engine"
              value="petrol"
              checked={engines.includes("petrol")}
              onChange={() => toggleEngine("petrol")}
            />
            Petrol
          </label>

          <label>
            <input
              type="checkbox"
              name="engine"
              value="hybrid"
              checked={engines.includes("hybrid")}
              onChange={() => toggleEngine("hybrid")}
            />
            Hybrid
          </label>

          <label>
            <input
              type="checkbox"
              name="engine"
              value="electric"
              checked={engines.includes("electric")}
              onChange={() => toggleEngine("electric")}
            />
            Electric
          </label>
        </fieldset>

        <fieldset>
          <legend>Transmission</legend>

          <label>
            <input
              type="checkbox"
              name="transmission"
              value="automatic"
              checked={transmissions.includes("automatic")}
              onChange={() =>
                setTransmissions((current) =>
                  current.includes("automatic")
                    ? current.filter((item) => item !== "automatic")
                    : [...current, "automatic"],
                )
              }
            />
            Automatic
          </label>

          <label>
            <input
              type="checkbox"
              name="transmission"
              value="manual"
              checked={transmissions.includes("manual")}
              onChange={() =>
                setTransmissions((current) =>
                  current.includes("manual")
                    ? current.filter((item) => item !== "manual")
                    : [...current, "manual"],
                )
              }
            />
            Manual
          </label>
        </fieldset>

        <fieldset>
          <legend>Camper form</legend>

          <label>
            <input
              type="checkbox"
              name="form"
              value="alcove"
              checked={forms.includes("alcove")}
              onChange={() => toggleForm("alcove")}
            />
            Alcove
          </label>

          <label>
            <input
              type="checkbox"
              name="form"
              value="panelVan"
              checked={forms.includes("panelVan")}
              onChange={() => toggleForm("panelVan")}
            />
            Panel Van
          </label>

          <label>
            <input
              type="checkbox"
              name="form"
              value="integrated"
              checked={forms.includes("integrated")}
              onChange={() => toggleForm("integrated")}
            />
            Integrated
          </label>

          <label>
            <input
              type="checkbox"
              name="form"
              value="semiIntegrated"
              checked={forms.includes("semiIntegrated")}
              onChange={() => toggleForm("semiIntegrated")}
            />
            Semi Integrated
          </label>
        </fieldset>

        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </section>
    </main>
  );
}
