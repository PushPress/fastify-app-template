import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">App Dashboard</h1>
        <Button>
          <span className="text-white">+ Add Component</span>
        </Button>
      </header>

      <div className="bg-[#EFF6FF] rounded-lg p-6">
        <p className="text-gray-700 mb-6">
          Start building your PushPress App dashboard here!
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="text-primary hover:underline font-medium">
            Helpful links
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
