import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex flex-col max-w-4xl mx-auto min-h-screen px-6 py-32 bg-gradient-to-b from-reelspro-black via-black to-reelspro-black text-center items-center justify-center overflow-hidden animate-zoomIn">
      
      {/* Background subtle glowing circles */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-reelspro-blue/20 rounded-full filter blur-3xl animate-floatingSlow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-reelspro-purple/15 rounded-full filter blur-2xl animate-floating"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-reelspro-cyan/10 rounded-full filter blur-xl animate-floatingSlow delay-3000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-reelspro-blue/15 rounded-full filter blur-xl animate-floating delay-2000"></div>
      </div>

      <h1 className="text-[10rem] font-extrabold text-reelspro-blue mb-6 animate-fadeInDown">
        404
      </h1>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeInUp">
        Page Not Found
      </h2>

      <p className="max-w-xl text-gray-300 text-lg mb-12 animate-fadeInUp delay-150">
        Oops! The page you’re looking for doesn’t exist or has been moved.
        Please check the URL or return home to start fresh.
      </p>

      <Link href="/">
        <Button className="bg-reelspro-blue text-white px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-300">
          Return Home
          
        </Button>
      </Link>
    </div>
  );
}
