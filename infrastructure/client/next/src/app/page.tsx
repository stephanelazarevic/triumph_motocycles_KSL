export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="text-center p-10 bg-white shadow-lg rounded-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Bienvenue sur mon app Next.js !</h1>
        <p className="text-lg text-gray-600 mb-6">
          C'est un plaisir de t'accueillir ici. Explore et commence à construire ta première page.
        </p>
        <a
          href="/login"
          className="inline-block bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transition-all"
        >
          Se connecter
        </a>
      </div>
    </main>
  );
}
