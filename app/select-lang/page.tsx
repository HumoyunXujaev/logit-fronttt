import Link from 'next/link';

export default function LanguageSelection() {
  return (
    <div className="flex flex-col min-h-screen bg-red-700">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white">
          <h1 className="text-3xl font-bold mb-4 text-center text-white">Выберите язык</h1>
          <section className="mb-8 text-center text-white">
            <p>Пожалуйста, выберите предпочитаемый язык</p>
          </section>
        </div>
      </main>
      <footer className="p-4 fixed bottom-0 left-0 right-0 flex justify-between">
        <Link href="/select-person" className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300">
         ru РУ
        </Link>
        <Link href="/select-person" className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300">
         uz УЗ
        </Link>
      </footer>
    </div>
  );
}