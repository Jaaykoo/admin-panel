'use client';

import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/hooks/auth/Auth';
import { cn } from '@/lib/utils';

export function Header() {
  const { currentUser, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const fullName = `${currentUser?.user_profile?.first_name} ${currentUser?.user_profile?.last_name}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 border-b border-gray-300 bg-white py-2 transition-all duration-300',
        isCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      )}
    >
      <div className="flex h-full items-center justify-end px-6">
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
