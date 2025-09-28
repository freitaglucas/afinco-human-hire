import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';
import afinLogo from '@/assets/afin-logo.png';

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={afinLogo} alt="Afin.co" className="h-8 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/jobs" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/jobs' ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              Encontrar Vagas
            </Link>
            <Link 
              to="/profile/1/candidate" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.includes('/profile') ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              Meu Perfil
            </Link>
            <Link 
              to="/recruiter" 
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                location.pathname === '/recruiter' ? 'text-secondary' : 'text-foreground/70'
              }`}
            >
              Para Recrutadores
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Sobre
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};