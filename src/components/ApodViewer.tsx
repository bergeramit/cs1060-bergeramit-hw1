import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApodData {
  date: string;
  explanation: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  hdurl?: string;
}

const ApodViewer = () => {
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
        
        if (!response.ok) {
          throw new Error("Failed to fetch APOD data");
        }
        
        const data = await response.json();
        setApodData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto bg-slate-800" />
          <Skeleton className="h-96 w-full bg-slate-800" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-slate-800" />
            <Skeleton className="h-4 w-5/6 bg-slate-800" />
            <Skeleton className="h-4 w-4/6 bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Alert className="max-w-md mx-auto border-red-500 bg-slate-900">
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!apodData) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              COSMOS
            </span>
            <span className="block text-3xl md:text-4xl font-light text-slate-400 mt-4 tracking-widest">
              DAILY
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light tracking-wide">
            Discover the universe, one image at a time
          </p>
          <p className="text-xl text-blue-400 font-medium">
            {formatDate(apodData.date)}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Image Section */}
          <div className="mb-16 overflow-hidden rounded-2xl">
            <div className="relative group bg-slate-900">
              {apodData.media_type === 'image' ? (
                <img
                  src={apodData.hdurl || apodData.url}
                  alt={apodData.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />
              ) : apodData.media_type === 'video' ? (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={apodData.url}
                    title={apodData.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400">
                    Media type not supported: {apodData.media_type}
                  </p>
                </div>
              )}
              
              {/* Floating Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {apodData.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-900 rounded-2xl p-12">
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-blue-400">
                About Today's Image
              </h3>
              <p className="text-slate-200 leading-relaxed text-xl">
                {apodData.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pt-12 border-t border-slate-800">
          <p className="text-slate-400 text-base">
            Powered by NASA's Astronomy Picture of the Day API
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApodViewer;