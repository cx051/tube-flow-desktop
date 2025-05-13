
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Settings, 
  Flame, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Youtube,
  VideoIcon,
  User2,
  Music2,
  Clock,
  History,
  ThumbsUp
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const mainNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Trending", path: "/?type=trending", icon: Flame },
    { name: "Search", path: "/?type=search", icon: Search },
  ];
  
  const libraryItems = [
    { name: "History", path: "/history", icon: History, disabled: true },
    { name: "Your Videos", path: "/your-videos", icon: VideoIcon, disabled: true },
    { name: "Watch Later", path: "/watch-later", icon: Clock, disabled: true },
    { name: "Liked Videos", path: "/liked", icon: ThumbsUp, disabled: true },
  ];

  const handleDisabledLink = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    toast({
      title: "Feature not available",
      description: `The ${name} feature is not implemented yet.`,
    });
  };

  return (
    <aside
      className={cn(
        "h-full transition-all duration-300 ease-in-out fixed left-0 top-0 z-30 glass border-r",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center p-4 h-14 border-b border-border/50",
          isOpen ? "justify-between" : "justify-center"
        )}>
          {isOpen && (
            <div className="flex items-center">
              <Youtube className="h-5 w-5 text-youtube-red" />
              <span className="ml-2 font-semibold">YouTube Browser</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 rounded-full",
              !isOpen && "mx-auto"
            )}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-2">
            <div className="px-3 py-2">
              {isOpen && <p className="text-xs text-muted-foreground mb-2">Main</p>}
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                        !isOpen && "justify-center"
                      )
                    }
                  >
                    <item.icon className={cn("h-4 w-4", isOpen && "mr-3")} />
                    {isOpen && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="px-3 py-2">
              {isOpen && <p className="text-xs text-muted-foreground mb-2">Library</p>}
              <nav className="space-y-1">
                {libraryItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50",
                      !isOpen && "justify-center"
                    )}
                    onClick={(e) => item.disabled && handleDisabledLink(e, item.name)}
                  >
                    <item.icon className={cn("h-4 w-4", isOpen && "mr-3")} />
                    {isOpen && <span>{item.name}</span>}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-border/50 p-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                !isOpen && "justify-center"
              )
            }
          >
            <Settings className={cn("h-4 w-4", isOpen && "mr-3")} />
            {isOpen && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
