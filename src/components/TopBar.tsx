
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function TopBar() {
  const { user, activeContext, logout } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="text-xl font-bold">Application</div>
      
      {user && activeContext && (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-sm">
            <span className="font-medium">{user.username}</span>
            <span className="text-muted-foreground">{activeContext.organizationalUnit} - {activeContext.role}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={user.username} />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="md:hidden">
                <User className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{user.username}</span>
                  <span className="text-xs text-muted-foreground">{activeContext.organizationalUnit} - {activeContext.role}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
