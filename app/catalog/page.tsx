"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  const [searchApplied, setSearchApplied] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["campers"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<CampersResponse> => {
      const response = await fetch(
        `https://campers-api.goit.study/campers?limit=4&page=${pageParam}`,
      );

      if (!response.ok) {
        throw new Error("Не вдалося завантажити кемпери");
      }

      return (await response.json()) as CampersResponse;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });

  const campers = data?.pages.flatMap((page) => page.campers) ?? [];

  const filteredCampers = campers.filter((camper) => {
    if (!searchApplied) {
      return true;
    }

    const matchesLocation = camper.location
      .toLowerCase()
      .includes(location.trim().toLowerCase());

    const matchesEngine =
      engines.length === 0 || engines.includes(camper.engine);

    const matchesTransmission =
      transmissions.length === 0 || transmissions.includes(camper.transmission);

    const matchesForm = forms.length === 0 || forms.includes(camper.form);

    return (
      matchesLocation && matchesEngine && matchesTransmission && matchesForm
    );
  });

  function toggleEngine(value: string) {
    setEngines((current) =>
      current.includes(value)
        ? current.filter((engine) => engine !== value)
        : [...current, value],
    );
  }

  function toggleTransmission(value: string) {
    setTransmissions((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
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
    setSearchApplied(true);
  }

  function clearFilters() {
    setLocation("");
    setEngines([]);
    setTransmissions([]);
    setForms([]);
    setSearchApplied(false);
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

        {isLoading && <p>Завантаження кемперів...</p>}
        {isError && <p>Помилка завантаження кемперів.</p>}

        {!isLoading && !isError && (
          <>
            <div>
              {filteredCampers.map((camper) => (
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
                  <p>
                    Коробка передач:{" "}
                    {camper.transmission === "automatic"
                      ? "Автоматична"
                      : "Механічна"}
                  </p>
                  <p>Місце розташування: {camper.location}</p>
                  <p>{camper.description}</p>
                </article>
              ))}
            </div>

            {filteredCampers.length === 0 && (
              <p>Кемперів за заданими фільтрами не знайдено.</p>
            )}

            {hasNextPage && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Завантаження..." : "Load more"}
              </button>
            )}
          </>
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
          {(["diesel", "petrol", "hybrid", "electric"] as const).map(
            (engine) => (
              <label key={engine}>
                <input
                  type="checkbox"
                  checked={engines.includes(engine)}
                  onChange={() => toggleEngine(engine)}
                />
                {engine}
              </label>
            ),
          )}
        </fieldset>

        <fieldset>
          <legend>Transmission</legend>
          {(["automatic", "manual"] as const).map((transmission) => (
            <label key={transmission}>
              <input
                type="checkbox"
                checked={transmissions.includes(transmission)}
                onChange={() => toggleTransmission(transmission)}
              />
              {transmission}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Camper form</legend>
          {(
            [
              ["alcove", "Alcove"],
              ["panel_van", "Panel Van"],
              ["integrated", "Integrated"],
              ["semi_integrated", "Semi Integrated"],
            ] as const
          ).map(([value, label]) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={forms.includes(value)}
                onChange={() => toggleForm(value)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <button type="button" onClick={handleSearch}>
          Search
        </button>
        <button type="button" onClick={clearFilters}>
          Clear filters
        </button>
      </section>
    </main>
  );
}
