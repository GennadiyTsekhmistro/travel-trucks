
"use client";

import { useState, type FormEvent } from "react";

type BookingFormProps = {
  camperId: string;
};

export default function BookingForm({ camperId }: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://campers-api.goit.study/campers/${camperId}/booking-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name, email }),
        },
      );

      const result = await response.json();

      if (response.status === 201) {
        setMessage(result.message || "Заявку успішно надіслано.");
        setName("");
        setEmail("");
      } else if (response.status === 404) {
        setMessage("Кемпера не знайдено.");
      } else {
        setMessage(result.message || `Помилка запиту: ${response.status}`);
      }
    } catch {
      setMessage("Не вдалося зв'язатися із сервером. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Забронювати кемпер</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="booking-name">Ім&apos;я</label>
          <input
            id="booking-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </p>

        <p>
          <label htmlFor="booking-email">Email</label>
          <input
            id="booking-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Надсилання..." : "Надіслати заявку"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
    </section>
  );
}