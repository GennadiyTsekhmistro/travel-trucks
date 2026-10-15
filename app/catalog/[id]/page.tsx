import Image from "next/image";

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
  amenities: string[];
  gallery: {
    id: string;
    camperId: string;
    thumb: string;
    original: string;
    order: number;
  }[];
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

  return response.json();
}

export default async function CamperDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const camper = await getCamper(id);

  if (!camper) {
    return (
      <main>
        <h1>Кемпер не знайдено</h1>
      </main>
    );
  }

  return (
    <main>
      {" "}
      <a href="/catalog">← Назад до каталогу</a>
      ```
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
        {camper.amenities.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>
    </main>
  );
}
