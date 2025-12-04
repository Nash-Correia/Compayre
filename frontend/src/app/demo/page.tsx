import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="container-max flex-1 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Demo</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
          This is a demo placeholder for the platform. We will upgrade this to
          a live interactive demo when available.
        </p>
      </main>
      <Footer />
    </div>
  );
}
