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
      <main>
        <h1>Кемпер не знайдено</h1>
        <Link href="/catalog">← Назад до каталогу</Link>
      </main>
    );
  }

  const amenities = Array.isArray(camper.amenities)
    ? camper.amenities
    : [camper.amenities];

  return (
    <main>
      <Link href="/catalog">← Назад до каталогу</Link>

      <h1>{camper.name}</h1>
      <p>Ціна: €{camper.price}</p>
      <p>
        Рейтинг: {camper.rating} ({camper.totalReviews} відгуків)
      </p>
      <p>Місце розташування: {camper.location}</p>
      <p>{camper.description}</p>

      <h2>Фотографії</h2>
      <div>
        {camper.gallery.map((photo) => (
          <Image
            key={photo.id}
            src={photo.original}
            alt={camper.name}
            width={400}
            height={300}
            style={{ objectFit: "cover" }}
          />
        ))}
      </div>

      <h2>Характеристики</h2>
      <ul>
        <li>Тип: {camper.form}</li>
        <li>Двигун: {camper.engine}</li>
        <li>Коробка передач: {camper.transmission}</li>
        <li>Довжина: {camper.length}</li>
        <li>Ширина: {camper.width}</li>
        <li>Висота: {camper.height}</li>
        <li>Бак: {camper.tank}</li>
        <li>Витрата пального: {camper.consumption}</li>
      </ul>

      <h2>Зручності</h2>
      <ul>
        {amenities.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>

      <h2>Відгуки</h2>
      {reviews.length === 0 ? (
        <p>Відгуків поки немає.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <h3>{review.reviewer_name}</h3>
              <p>Оцінка: {review.reviewer_rating} / 5</p>
              <p>{review.comment}</p>
              <p>{new Date(review.createdAt).toLocaleDateString("uk-UA")}</p>
            </li>
          ))}
        </ul>
      )}

      <BookingForm camperId={camper.id} />
    </main>
  );
}
