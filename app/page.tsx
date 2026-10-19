import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <button className="home-close" type="button" aria-label="Закрити">
        ×
      </button>{" "}
      <div className="hero">
        {" "}
        <div className="hero-overlay">
          {" "}
          <div className="hero-content">
            {" "}
            <div className="hero-title-block">
              {" "}
              <div className="hero-text">
                {" "}
                <h1>Campers of your dreams</h1>{" "}
                <p>You can find everything you want in our catalog</p>{" "}
              </div>
              <Link href="/catalog" className="hero-button">
                View Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
