
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Eye, User2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
  onClick: () => void;
  index: number;
}

export function VideoCard({
  id,
  title,
  thumbnail,
  channelTitle,
  viewCount,
  publishedAt,
  onClick,
  index,
}: VideoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Format numbers with commas
  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  // Format the relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div 
      className={cn(
        "video-card rounded-md overflow-hidden border border-white/5 bg-card transition-all duration-500 animate-slide-up cursor-pointer",
        !isLoaded && "animate-pulse"
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
        opacity: isLoaded ? 1 : 0.7,
      }}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={thumbnail}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            !isLoaded && "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium">
          <Clock className="w-3 h-3 inline mr-1" />
          {formatRelativeTime(publishedAt)}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium line-clamp-2 mb-2 text-sm md:text-base font-montserrat" title={title}>
          {title}
        </h3>
        
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <User2 className="w-3 h-3 mr-1 text-red-400" />
          <span className="truncate mr-3" title={channelTitle}>{channelTitle}</span>
          
          <Eye className="w-3 h-3 mr-1 text-red-400" />
          <span>{formatNumber(viewCount)} views</span>
        </div>
      </div>
    </div>
  );
}
