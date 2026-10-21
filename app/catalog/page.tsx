"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

type Camper = {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  form: "alcove" | "panel_van" | "integrated" | "semi_integrated";
  length: string;
  width: string;
  height: string;
  tank: string;
  consumption: string;
  transmission: "automatic" | "manual";
  engine: "diesel" | "petrol" | "hybrid" | "electric";
  amenities: (
    | "ac"
    | "bathroom"
    | "kitchen"
    | "tv"
    | "radio"
    | "refrigerator"
    | "microwave"
    | "gas"
    | "water"
  )[];
  coverImage: string;
  totalReviews: number;
};

type CamperFilters = {
  forms: string[];
  transmissions: string[];
  engines: string[];
};

type CampersResponse = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  campers: Camper[];
};

export default function Catalog() {
  const [engine, setEngine] = useState("");
  const [transmission, setTransmission] = useState("");
  const [form, setForm] = useState("");
  const [location, setLocation] = useState("");
  const [searchApplied, setSearchApplied] = useState(false);

  const {
    data: filters,
    isLoading: isFiltersLoading,
    isError: isFiltersError,
  } = useQuery({
    queryKey: ["camper-filters"],
    queryFn: async (): Promise<CamperFilters> => {
      const response = await fetch(
        "https://campers-api.goit.study/campers/filters",
      );

      if (!response.ok) {
        throw new Error("Не вдалося завантажити фільтри");
      }

      return response.json() as Promise<CamperFilters>;
    },
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "campers",
      searchApplied,
      searchApplied ? location.trim() : "",
      searchApplied ? engine : "",
      searchApplied ? transmission : "",
      searchApplied ? form : "",
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<CampersResponse> => {
      const params = new URLSearchParams();

      params.set("page", String(pageParam));
      params.set("perPage", "4");

      if (searchApplied) {
        if (location.trim()) {
          params.set("location", location.trim());
        }

        if (engine) {
          params.set("engine", engine);
        }

        if (transmission) {
          params.set("transmission", transmission);
        }

        if (form) {
          params.set("form", form);
        }
      }

      const response = await fetch(
        `https://campers-api.goit.study/campers?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Не вдалося завантажити кемпери");
      }

      return (await response.json()) as CampersResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const campers = data?.pages.flatMap((page) => page.campers) ?? [];

  function toggleEngine(value: string) {
    setEngine((current) => (current === value ? "" : value));
  }

  function toggleTransmission(value: string) {
    setTransmission((current) => (current === value ? "" : value));
  }

  function toggleForm(value: string) {
    setForm((current) => (current === value ? "" : value));
  }

  function handleSearch() {
    setSearchApplied(true);
  }

  function clearFilters() {
    setLocation("");
    setEngine("");
    setTransmission("");
    setForm("");
    setSearchApplied(false);
  }

  return (
    <main className="catalog-page">
      <div className="catalog-layout">
        <aside className="catalog-navigation">
          <div className="catalog-info">
            <div className="catalog-location">
              <label className="catalog-location-label" htmlFor="location">
                Location
              </label>

              <div className="catalog-location-input">
                <Image src="/map.svg" alt="" width={20} height={20} />

                <input
                  id="location"
                  type="text"
                  placeholder="City"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </div>
            </div>

            <div className="catalog-filters">
              <h2>Filters</h2>

              {isFiltersLoading && <p>Завантаження фільтрів...</p>}

              {isFiltersError && <p>Помилка завантаження фільтрів.</p>}

              {filters && (
                <>
                  <fieldset className="catalog-form-filter">
                    <legend>Camper form</legend>

                    {filters.forms.map((value) => (
                      <label className="catalog-form-option" key={value}>
                        <input
                          type="checkbox"
                          checked={form === value}
                          onChange={() => toggleForm(value)}
                        />
                        <span
                          className="catalog-radio-circle"
                          aria-hidden="true"
                        />
                        <span>
                          {value
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </span>
                      </label>
                    ))}
                  </fieldset>

                  <fieldset className="catalog-engine-filter">
                    <legend>Engine</legend>

                    {filters.engines.map((value) => (
                      <label className="catalog-engine-option" key={value}>
                        <input
                          type="checkbox"
                          checked={engine === value}
                          onChange={() => toggleEngine(value)}
                        />
                        <span
                          className="catalog-engine-circle"
                          aria-hidden="true"
                        />
                        <span>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </span>
                      </label>
                    ))}
                  </fieldset>

                  <fieldset className="catalog-transmission-filter">
                    <legend>Transmission</legend>

                    {filters.transmissions.map((value) => (
                      <label
                        className="catalog-transmission-option"
                        key={value}
                      >
                        <input
                          type="checkbox"
                          checked={transmission === value}
                          onChange={() => toggleTransmission(value)}
                        />
                        <span
                          className="catalog-transmission-circle"
                          aria-hidden="true"
                        />
                        <span>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                </>
              )}
            </div>
          </div>

          <div className="catalog-buttons">
            <button
              className="catalog-search-button"
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              className="catalog-clear-button"
              type="button"
              onClick={clearFilters}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.25 17.25L6.75 6.75M17.25 6.75L6.75 17.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Clear filters</span>
            </button>
          </div>
        </aside>

        <section className="catalog-results">
          {isLoading && <p>Завантаження кемперів...</p>}

          {isError && <p>Помилка завантаження кемперів.</p>}

          {!isLoading && !isError && (
            <>
              <ul className="catalog-campers">
                {campers.map((camper) => (
                  <li className="catalog-camper" key={camper.id}>
                    <div className="catalog-camper-content">
                      <Link
                        href={`/catalog/${camper.id}`}
                        className="catalog-camper-image"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={camper.coverImage}
                          alt={camper.name}
                          width={219}
                          height={240}
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </Link>

                      <div className="catalog-camper-info">
                        <div className="catalog-camper-heading">
                          <div className="catalog-camper-title-row">
                            <h2>{camper.name}</h2>

                            <p className="catalog-camper-price">
                              €{camper.price}
                            </p>
                          </div>

                          <div className="catalog-camper-details">
                            <div className="catalog-camper-rating">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="#FFC531"
                                aria-hidden="true"
                              >
                                <path d="M8 0.8l2.2 4.45 4.9.71-3.55 3.46.84 4.88L8 12l-4.39 2.3.84-4.88L.9 5.96l4.9-.71L8 .8z" />
                              </svg>
                              <span>{camper.rating}</span>
                            </div>

                            <div className="catalog-camper-location">
                              <Image
                                src="/map.svg"
                                alt=""
                                width={16}
                                height={16}
                              />
                              <span>{camper.location}</span>
                            </div>
                          </div>
                        </div>

                        <p className="catalog-camper-description">
                          {camper.form.replace("_", " ")}
                        </p>

                        <div className="catalog-camper-badges">
                          <span className="catalog-camper-badge">
                            <Image
                              src="/petrol.svg"
                              alt=""
                              width={20}
                              height={20}
                            />
                            {camper.engine.charAt(0).toUpperCase() +
                              camper.engine.slice(1)}
                          </span>

                          <span className="catalog-camper-badge">
                            <Image
                              src="/automatic.svg"
                              alt=""
                              width={20}
                              height={20}
                            />
                            {camper.transmission.charAt(0).toUpperCase() +
                              camper.transmission.slice(1)}
                          </span>

                          <span className="catalog-camper-badge">
                            <Image
                              src="/alcove.svg"
                              alt=""
                              width={20}
                              height={20}
                            />
                            {camper.form
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </span>
                        </div>

                        <Link
                          href={`/catalog/${camper.id}`}
                          className="catalog-camper-button"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Show more
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {campers.length === 0 && (
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
        </section>
      </div>
    </main>
  );
}
