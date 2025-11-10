'use client';

import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/auth/Auth';

export function Header() {
  const { currentUser, logout } = useAuth();
  const fullName = `${currentUser?.user_profile?.first_name} ${currentUser?.user_profile?.last_name}`;
  const handleLogout = () => {
    logout();
  };
  return (
    <header className="fixed top-0 right-0 left-64 z-30 h-16 border-b border-gray-300 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input type="search" placeholder="Rechercher..." className="border-gray-300 pl-10" />
          </div>
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Ouvrir le menu utilisateur</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm leading-6 font-semibold text-gray-900" aria-hidden="true">
                  {fullName}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* <DropdownMenuItem>Mon profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleLogout}>Se déconnecter</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
