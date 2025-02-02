import SearchBar from "./components/SearchBar";
import CategoryDisplay from "./components/CategoryDisplay";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-orange-800 mb-4">
            Welcome to Postly!
          </h1>
          <p className="text-xl text-orange-700 max-w-2xl mx-auto">
            Your one-stop marketplace for finding exactly what you need. Browse,
            buy, and connect with your community.
          </p>
        </header>

        <div className="bg-orange-50 rounded-lg shadow-xl p-6 mb-12">
          <SearchBar />
        </div>

        <section className="mb-12">
          <CategoryDisplay />
        </section>

        <section className="bg-orange-50 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold text-orange-800 mb-4">
                Ready to start selling?
              </h2>
              <p className="text-lg text-orange-700 mb-4">
                Turn your unused items into cash. It's quick, easy, and free to
                list on Postly!
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Post an Item <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="w-full md:w-1/3">
              <ShoppingBag className="w-full h-auto text-orange-400 opacity-20" />
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold text-orange-800 mb-4">
            Why Choose Postly?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">
                Local Community
              </h3>
              <p className="text-orange-600">
                Connect with buyers and sellers in your area.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">
                Easy to Use
              </h3>
              <p className="text-orange-600">
                Simple, intuitive interface for buying and selling.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">
                Secure Transactions
              </h3>
              <p className="text-orange-600">
                Safe and protected buying and selling experience.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
