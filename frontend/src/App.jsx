import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">TailwindX</h1>
        <p className="text-gray-600 mt-2">Tailwind UI Component Library</p>
      </div>
    </div>
  );
}

export default App;