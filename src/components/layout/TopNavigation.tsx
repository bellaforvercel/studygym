import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  User,
  Crown,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const { user, signOut } = useAuth();
  const { subscription, isPremium, isPro } = usePayment();
  const navigate = useNavigate();

  if (isZenMode) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const getPlanBadge = () => {
    if (isPro) {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      );
    }
    if (isPremium) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Premium
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        Free
      </Badge>
    );
  };

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

        {/* Plan Badge */}
        {getPlanBadge()}

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
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <div className="pt-1">
                  {getPlanBadge()}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings?tab=billing')}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}