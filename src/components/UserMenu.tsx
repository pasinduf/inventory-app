import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConfirmDialog from "./ui/confirm-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { tokenRepository } from "@/api";

export function UserMenu() {

  const { auth, setAuth }: any = useAuth();
  const navigate = useNavigate();

  const handleProfile = () => {
    console.log("Navigate to profile");
  };


   const onConfirmLogout = () => {
     setAuth({});
     tokenRepository.removeAccessAuth();
     navigate("/", { replace: false });
   };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <Avatar className="h-8 w-8 bg-slate-400">
            {/* <AvatarImage src="/placeholder.svg" alt="User" /> */}
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg z-50">
        <DropdownMenuItem onClick={handleProfile}>
          <Settings className="h-4 w-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <ConfirmDialog confirmText="Logout" description="Are you sure you want to log out?" onConfirm={onConfirmLogout}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
