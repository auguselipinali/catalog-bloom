import { useEffect, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingCart, X, Trash2, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business } from "../types";
import { useCart } from "../hooks/use-cart";
import { formatARS } from "../lib/catalog";
import {
  readOrderPending,
  whatsappNumber,
  whatsappOrderUrl,
  writeOrderPending,
} from "../lib/cart";
import { QuantitySelector } from "./quantity-selector";
export function CartDrawer({
  business,
  open,
  onOpenChange,
}: {
  business: Business;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cart = useCart(business);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const destinationReady = Boolean(whatsappNumber(business.whatsappNumber));
  useEffect(() => {
    if (open) setPending(readOrderPending(business.slug));
  }, [open, business.slug]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const url = whatsappOrderUrl(business, cart.entries, name, note);
      writeOrderPending(business.slug, true);
      window.location.assign(url);
    } catch (e) {
      writeOrderPending(business.slug, false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }
  function resolvePending(clearCart: boolean) {
    writeOrderPending(business.slug, false);
    setPending(false);
    if (clearCart) {
      cart.clear();
      setConfirmed(true);
    }
  }
  const showPending = pending && cart.lines.length > 0;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cart-overlay" />
        <Dialog.Content className="cart-panel">
          <div className="cart-panel-header">
            <div>
              <Dialog.Title>Tu carrito</Dialog.Title>
              <Dialog.Description>
                {business.name} · {cart.count} {cart.count === 1 ? "producto" : "productos"}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Cerrar carrito">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          {showPending ? (
            <div className="cart-empty">
              <div className="empty-icon">
                <MessageCircle />
              </div>
              <h2>¿Se envió tu pedido?</h2>
              <p>Si ya mandaste el mensaje por WhatsApp, podés vaciar el carrito.</p>
              <Button variant="catalog" onClick={() => resolvePending(true)}>
                Sí, vaciar carrito
              </Button>
              <Button variant="catalogOutline" onClick={() => resolvePending(false)}>
                Mantener productos
              </Button>
            </div>
          ) : cart.lines.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">{confirmed ? <Check /> : <ShoppingCart />}</div>
              <h2>{confirmed ? "Pedido enviado" : "Tu carrito está vacío"}</h2>
              <p>
                {confirmed
                  ? "Vaciamos tu carrito. ¡Gracias por tu pedido!"
                  : "Encontrá tus favoritos y sumalos al carrito."}
              </p>
              <Button
                variant="catalog"
                onClick={() => {
                  onOpenChange(false);
                  setConfirmed(false);
                }}
              >
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="cart-panel-body">
              <ul className="cart-items">
                {cart.lines.map((line) => (
                  <li key={line.productId} className="cart-item">
                    <img
                      src={line.product.images[0]}
                      alt={line.product.name}
                      width={76}
                      height={76}
                    />
                    <div className="min-w-0">
                      <div className="cart-item-heading">
                        <h2>{line.product.name}</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Quitar ${line.product.name}`}
                          title="Quitar producto"
                          onClick={() => cart.remove(line.productId)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <p className="cart-unit-price">{formatARS(line.product.price)} / unidad</p>
                      <div className="cart-item-bottom">
                        <QuantitySelector
                          value={line.quantity}
                          max={line.product.stock}
                          label={line.product.name}
                          onChange={(value) => cart.setQuantity(line.productId, value)}
                        />
                        <strong>{formatARS(line.subtotal)}</strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <form className="cart-checkout" onSubmit={submit}>
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{formatARS(cart.total)}</strong>
                </div>
                <label htmlFor="customer-name">
                  Tu nombre <span aria-hidden="true">*</span>
                </label>
                <input
                  id="customer-name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre y apellido"
                />
                <label htmlFor="customer-note">
                  Nota <span className="text-muted-foreground">(opcional)</span>
                </label>
                <textarea
                  id="customer-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej.: retiro por local"
                  rows={2}
                />
                {!destinationReady && (
                  <p className="cart-warning" role="status">
                    El negocio aún no tiene un número de WhatsApp completo.
                  </p>
                )}
                {cart.storageError && (
                  <p className="cart-warning">No pudimos guardar el carrito en este navegador.</p>
                )}
                {error && (
                  <p className="cart-warning" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="catalog"
                  className="whatsapp-submit"
                  disabled={!destinationReady || !name.trim()}
                >
                  <MessageCircle />
                  Enviar pedido por WhatsApp
                </Button>
              </form>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
