import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function QuantitySelector({value,max,onChange,label}:{value:number;max:number;onChange:(value:number)=>void;label:string}) {
 return <div className="quantity-selector" role="group" aria-label={`Cantidad de ${label}`}><Button variant="ghost" size="icon" aria-label={`Reducir cantidad de ${label}`} disabled={value<=1} onClick={()=>onChange(value-1)}><Minus/></Button><output aria-live="polite">{value}</output><Button variant="ghost" size="icon" aria-label={`Aumentar cantidad de ${label}`} disabled={value>=max} onClick={()=>onChange(value+1)}><Plus/></Button></div>;
}
