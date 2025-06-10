import React from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNavigationProps {
  currentDocument?: string;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function TopNavigation({ 
  currentDocument, 
  isZenMode, 
  onToggleZenMode,
  isDarkMode,
  onToggleDarkMode 
}: TopNavigationProps) {
  if (isZenMode) return null;

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">StudyFlow</span>
        </div>
      </div>

      {/* Center: Current Document */}
      <div className="flex-1 max-w-md mx-8">
        {currentDocument ? (
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 truncate">
              {currentDocument}
            </h2>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No document selected
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            className="pl-10 w-64 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        </Button>

        {/* Zen Mode Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleZenMode}
          className="hover:bg-gray-100 transition-colors"
        >
          <Moon className="w-4 h-4" />
        </Button>

        {/* Dark Mode Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleDarkMode}
          className="hover:bg-gray-100 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Settings & User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alex Johnson</p>
                <p className="text-xs leading-none text-muted-foreground">
                  alex@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}