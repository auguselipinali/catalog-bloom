import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Search, X, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { catalogQuery, selectProducts } from '../lib/catalog';
import type { PriceOrder } from '../types';
import { CatalogHeader } from './catalog-header';
import { ProductCard } from './product-card';
import { EmptyState } from './catalog-states';
export function CatalogPage({slug}:{slug:string}) {
 const {data:business}=useSuspenseQuery(catalogQuery(slug));
 const [query,setQuery]=useState(''); const [category,setCategory]=useState('all'); const [order,setOrder]=useState<PriceOrder>('default');
 const products=selectProducts(business.products,query,category,order);
 const defaultView=!query && category==='all' && order==='default';
 return <><CatalogHeader business={business}/><main className="catalog-container catalog-main"><div className="search-field rise"><Search size={18} className="shrink-0 text-muted-foreground"/><input type="search" aria-label="Buscar en el catálogo" placeholder="Buscar en el catálogo…" value={query} onChange={e=>setQuery(e.target.value)}/>{query && <Button variant="ghost" size="icon" aria-label="Limpiar búsqueda" onClick={()=>setQuery('')}><X/></Button>}</div><nav className="category-chips" aria-label="Categorías"><Button variant={category==='all'?'chipActive':'chip'} onClick={()=>setCategory('all')} aria-pressed={category==='all'}>Todo</Button>{business.categories.map(c=><Button key={c.id} variant={category===c.id?'chipActive':'chip'} aria-pressed={category===c.id} onClick={()=>setCategory(c.id)}>{c.name}</Button>)}</nav><div className="catalog-toolbar"><h1 aria-live="polite">{products.length} {products.length===1?'producto':'productos'}</h1><div className="sort-field"><ArrowDownUp size={13}/><select aria-label="Ordenar por precio" value={order} onChange={e=>setOrder(e.target.value as PriceOrder)}><option value="default">Ordenar: precio</option><option value="asc">Menor precio</option><option value="desc">Mayor precio</option></select></div></div>{products.length>0?<div className="product-grid" key={`${category}-${order}`} >{products.map((p,i)=><ProductCard key={p.id} product={p} slug={slug} featured={defaultView&&i===0} category={business.categories.find(c=>c.id===p.categoryId)?.name}/>)}</div>:<EmptyState onReset={()=>{setQuery('');setCategory('all');setOrder('default');}}/>}</main></>;
}
