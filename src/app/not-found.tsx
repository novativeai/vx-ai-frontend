import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-8xl font-bold text-[#D4FF4F] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-neutral-400 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button className="bg-[#D4FF4F] text-black hover:bg-[#D4FF4F]/90">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
