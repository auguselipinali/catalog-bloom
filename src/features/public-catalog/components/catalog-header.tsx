import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Business } from '../types';
export function CatalogHeader({business}:{business: Business}) { return <header className="catalog-header"><div className="catalog-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 h-18"><Link to="/c/$slug" params={{slug:business.slug}} className="flex min-w-0 items-center gap-3" aria-label={`${business.name}, inicio`}><div className="brand-mark shrink-0">L</div><div className="min-w-0"><p className="brand-name truncate">{business.name}</p><p className="brand-tagline">{business.tagline}</p></div></Link><Button variant="cart" size="icon" className="shrink-0" aria-label="Carrito (próximamente)" title="Carrito (próximamente)" aria-disabled="true"><ShoppingCart size={19}/></Button></div></header>; }
