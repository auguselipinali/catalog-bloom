import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoBusiness } from '../data/demo';
import { cartStorageKey } from '../lib/cart';
import { CartDrawer } from './cart-drawer';
afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('WhatsApp handoff',()=>{
 it('clears cart and confirms preparation only after opening WhatsApp',async()=>{
  const business={...demoBusiness,slug:'handoff-success',whatsappNumber:'5492641234567'};
  localStorage.setItem(cartStorageKey(business.slug),JSON.stringify([{productId:'2',quantity:2}]));
  const popup={opener:{},location:{href:''}};
  const open=vi.spyOn(window,'open').mockReturnValue(popup as unknown as Window);
  render(<CartDrawer business={business} open onOpenChange={()=>{}}/>);
  await waitFor(()=>expect(screen.getByLabelText('Tu nombre *')).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText('Tu nombre *'),{target:{value:'Ana'}});
  fireEvent.change(screen.getByLabelText(/Nota/),{target:{value:'retiro por local'}});
  fireEvent.click(screen.getByRole('button',{name:'Enviar pedido por WhatsApp'}));
  expect(open).toHaveBeenCalledTimes(1);
  expect(popup.location.href).toContain('https://wa.me/5492641234567?text=');
  expect(decodeURIComponent(popup.location.href)).toContain('Total: $25.000');
  expect(decodeURIComponent(popup.location.href)).toContain('Nombre: Ana');
  expect(localStorage.getItem(cartStorageKey(business.slug))).toBe('[]');
  expect(screen.getByRole('heading',{name:'Pedido preparado'})).toBeInTheDocument();
 });
 it('keeps cart when the popup is blocked',async()=>{
  const business={...demoBusiness,slug:'handoff-blocked',whatsappNumber:'5492641234567'};
  localStorage.setItem(cartStorageKey(business.slug),JSON.stringify([{productId:'2',quantity:1}]));
  vi.spyOn(window,'open').mockReturnValue(null);
  render(<CartDrawer business={business} open onOpenChange={()=>{}}/>);
  await waitFor(()=>expect(screen.getByLabelText('Tu nombre *')).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText('Tu nombre *'),{target:{value:'Ana'}});
  fireEvent.click(screen.getByRole('button',{name:'Enviar pedido por WhatsApp'}));
  expect(JSON.parse(localStorage.getItem(cartStorageKey(business.slug))??'[]')).toEqual([{productId:'2',quantity:1}]);
  expect(screen.getByRole('alert')).toBeInTheDocument();
 });
});
