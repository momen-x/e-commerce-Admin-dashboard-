"use client"
import Lottie from "lottie-react";
import notFound from "@/app/assets/lottiefiles/notFound.json";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Lottie Animation */}
        <div className="mb-4">
          <Lottie 
            animationData={notFound} 
            loop={true}
            className="w-full h-56"
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
            <p className="text-muted-foreground">
              We couldn&apos;t find the page you were looking for.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;