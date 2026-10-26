import Image from "next/image";
import Link from "next/link";
import BookingForm from "./BookingForm";

type Camper = {
  id: string;
  name: string;
  price: number;
  rating: number;
  totalReviews: number;
  location: string;
  description: string;
  form: string;
  length: string;
  width: string;
  height: string;
  tank: string;
  consumption: string;
  transmission: string;
  engine: string;
  amenities: string[] | string;
  gallery: {
    id: string;
    camperId: string;
    thumb: string;
    original: string;
    order: number;
  }[];
};

type Review = {
  id: string;
  camperId: string;
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
  createdAt: string;
};

async function getCamper(id: string): Promise<Camper | null> {
  const response = await fetch(`https://campers-api.goit.study/campers/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Не вдалося завантажити кемпер");
  }

  return (await response.json()) as Camper;
}

async function getReviews(id: string): Promise<Review[]> {
  const response = await fetch(
    `https://campers-api.goit.study/campers/${id}/reviews`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Не вдалося завантажити відгуки");
  }

  return (await response.json()) as Review[];
}

export default async function CamperDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const camper = await getCamper(id);
  const reviews = camper ? await getReviews(id) : [];

  if (!camper) {
    return (
      <main className="details-main">
        <h1>Кемпер не знайдено</h1>
        <Link href="/catalog">← Назад до каталогу</Link>
      </main>
    );
  }

  return (
    <div className="details-page">
      <main className="details-main">
        <section className="top-section">
          <div className="image-thumbnails">
            {camper.gallery.length > 0 && (
              <Image
                className="details-main-image"
                src={camper.gallery[0].original}
                alt={camper.name}
                width={638}
                height={505}
                priority
              />
            )}

            <div className="details-thumbnails">
              {/* {camper.gallery.slice(1).map((photo) => ( */}
                {camper.gallery.map((photo) => (
                <Image
                  key={photo.id}
                  src={photo.original}
                  alt={camper.name}
                  width={135}
                  height={144}
                />
              ))}
            </div>
          </div>

          <div className="info-container">
            <section className="header-rating">
              <div className="details-title">
                <div className="details-title-row">
                  <h1>{camper.name}</h1>
                </div>

                <div className="details-rating">
                  <div className="details-reviews">
                    <div className="details-review-rating">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 1.2L10.1 5.5L14.8 6.2L11.4 9.5L12.2 14.2L8 12L3.8 14.2L4.6 9.5L1.2 6.2L5.9 5.5L8 1.2Z"
                          fill="#FFC531"
                          stroke="#FFC531"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span>
                        {camper.rating} ({camper.totalReviews} Reviews)
                      </span>
                    </div>

                    <div className="details-location">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M15.8 0.5V14.5L10.5 15.5L5.5 14.5L0.5 15.5V1.5L5.5 0.5L10.5 1.5L15.8 0.5Z"
                          stroke="#101828"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.5 0.5V14.5M10.5 1.5V15.5"
                          stroke="#101828"
                        />
                      </svg>

                      <span>{camper.location}</span>
                    </div>
                  </div>

                  <p className="details-price">€{camper.price}</p>
                </div>
              </div>
            </section>

            <section className="details-info">
              <div className="features-section">
                <h2>Vehicle details</h2>

                <div className="badges-container">
                  <span className="details-badge">Automatic</span>
                  <span className="details-badge">AC</span>
                  <span className="details-badge">Petrol</span>
                  <span className="details-badge">Kitchen</span>
                  <span className="details-badge">Radio</span>
                  <span className="details-badge">Alcove</span>
                </div>
              </div>

              <div className="details-divider" />

              <div className="details-attributes">
                <div className="details-attribute">
                  <span>Form</span>
                  <span>{camper.form}</span>
                </div>

                <div className="details-attribute">
                  <span>Length</span>
                  <span>{camper.length}</span>
                </div>

                <div className="details-attribute">
                  <span>Width</span>
                  <span>{camper.width}</span>
                </div>

                <div className="details-attribute">
                  <span>Height</span>
                  <span>{camper.height}</span>
                </div>

                <div className="details-attribute">
                  <span>Tank</span>
                  <span>{camper.tank}</span>
                </div>

                <div className="details-attribute">
                  <span>Consumption</span>
                  <span>{camper.consumption}</span>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="reviews-section">
          <h2>Відгуки</h2>

          {reviews.length === 0 ? (
            <p>Відгуків поки немає.</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  <h3>{review.reviewer_name}</h3>

                  <p aria-label={`Оцінка: ${review.reviewer_rating} з 5`}>
                    {"★".repeat(review.reviewer_rating)}
                    {"☆".repeat(5 - review.reviewer_rating)}
                  </p>

                  <p>{review.comment}</p>

                  <p>
                    {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <BookingForm camperId={camper.id} />
        </section>
      </main>
    </div>
  );
}
