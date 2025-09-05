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
      <div className="min-h-screen cosmic-gradient flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto bg-muted/20" />
          <Skeleton className="h-96 w-full bg-muted/20" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-muted/20" />
            <Skeleton className="h-4 w-5/6 bg-muted/20" />
            <Skeleton className="h-4 w-4/6 bg-muted/20" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center p-6">
        <Alert className="max-w-md mx-auto border-destructive/50 bg-card/50 backdrop-blur-sm">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!apodData) return null;

  return (
    <div className="min-h-screen cosmic-gradient">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
            <span className="nebula-gradient bg-clip-text text-transparent animate-glow">
              COSMOS
            </span>
            <span className="block text-2xl md:text-3xl font-light text-muted-foreground mt-2 tracking-widest">
              DAILY
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2 font-light tracking-wide">
            Discover the universe, one image at a time
          </p>
          <p className="text-lg text-primary font-medium">
            {formatDate(apodData.date)}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Image Section */}
          <Card className="mb-12 overflow-hidden border-border/20 bg-card/30 backdrop-blur-sm cosmic-shadow">
            <div className="relative group">
              {apodData.media_type === 'image' ? (
                <img
                  src={apodData.hdurl || apodData.url}
                  alt={apodData.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
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
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Media type not supported: {apodData.media_type}
                  </p>
                </div>
              )}
              
              {/* Floating Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {apodData.title}
                </h2>
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <Card className="border-border/20 bg-card/30 backdrop-blur-sm cosmic-shadow">
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-primary">
                About Today's Image
              </h3>
              <p className="text-foreground/90 leading-relaxed text-lg">
                {apodData.explanation}
              </p>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border/20">
          <p className="text-muted-foreground text-sm">
            Powered by NASA's Astronomy Picture of the Day API
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApodViewer;