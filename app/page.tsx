export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-red-100">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-600 bg-clip-text text-transparent">
          Welcome
        </h1>
        <p className="text-2xl text-rose-600">
          Experience an immersive love story
        </p>
        <a
          href="/love-story"
          className="inline-block px-12 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
        >
          Begin the Journey ♥
        </a>
      </div>
    </div>
  );
}
