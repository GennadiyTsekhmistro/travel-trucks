
"use client";

import { useState, type FormEvent } from "react";

type BookingFormProps = {
  camperId: string;
};

export default function BookingForm({ camperId }: BookingFormProps) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function isValidEmail(value: string) {
    const parts = value.trim().split("@");

    return (
      parts.length === 2 &&
      parts[0].length > 0 &&
      parts[1].includes(".") &&
      !parts[1].startsWith(".") &&
      !parts[1].endsWith(".")
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setNameTouched(true);
      setNameError(true);
      return;
    }

    setNameError(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailTouched(true);
      setEmailFormatError(false);
      setEmailError(true);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailTouched(true);
      setEmailFormatError(true);
      setEmailError(true);
      return;
    }

    setEmailError(false);
    setEmailFormatError(false);
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
          body: JSON.stringify({
            name: name.trim(),
            email: trimmedEmail,
          }),
        },
      );

      const result = await response.json();

      if (response.status === 201) {
        setMessage(result.message || "Заявку успішно надіслано.");

        setName("");
        setNameError(false);
        setNameTouched(false);

        setEmail("");
        setEmailError(false);
        setEmailTouched(false);
        setEmailFormatError(false);
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
    <section className="booking-section">
      <div className="booking-title">
        <h2>Book your campervan now</h2>
        <p>Stay connected! We are always ready to help you.</p>
      </div>

      <form className="booking-inputs" onSubmit={handleSubmit} noValidate>
        <div className="booking-input-form">
          <input
            id="booking-name"
            name="name"
            type="text"
            placeholder="Name*"
            aria-label="Name"
            value={name}
            onBlur={() => {
              setNameTouched(true);
              setNameError(!name.trim());
            }}
            onChange={(event) => {
              const value = event.target.value;
              setName(value);

              if (nameTouched) {
                setNameError(!value.trim());
              }
            }}
            required
          />

          {nameError && (
            <p className="booking-name-error">
              Please enter your full name.
            </p>
          )}

          <input
            id="booking-email"
            name="email"
            type="email"
            placeholder="Email*"
            aria-label="Email"
            value={email}
            onBlur={() => {
              setEmailTouched(true);

              const value = email.trim();
              const isEmpty = !value;
              const isInvalidFormat = value.length > 0 && !isValidEmail(value);

              setEmailFormatError(isInvalidFormat);
              setEmailError(isEmpty || isInvalidFormat);
            }}
            onChange={(event) => {
              const value = event.target.value;
              setEmail(value);

              if (emailTouched) {
                const trimmedValue = value.trim();
                const isEmpty = !trimmedValue;
                const isInvalidFormat =
                  trimmedValue.length > 0 && !isValidEmail(trimmedValue);

                setEmailFormatError(isInvalidFormat);
                setEmailError(isEmpty || isInvalidFormat);
              }
            }}
            required
          />

          {emailError && (
            <p className="booking-name-error">
              {emailFormatError
                ? "Please enter a valid email address."
                : "Email should not be empty"}
            </p>
          )}
        </div>

        <button
          className="booking-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>

      {message && (
        <p className="booking-message" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
