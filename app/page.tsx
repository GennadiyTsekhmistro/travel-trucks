import Link from "next/link";

export default function Home() {
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
        <h1>Campers of your dreams</h1>
        <p>You can find everything you want in our catalog</p>
        <Link href="/catalog">View Now</Link>
      </section>
    </main>
  );
}
