import { createFileRoute, redirect } from '@tanstack/react-router';
import { catalogHead } from '@/features/public-catalog/lib/catalog';
export const Route = createFileRoute('/')({beforeLoad:()=>{throw redirect({to:'/c/$slug',params:{slug:'lumina'},replace:true});},head:()=>catalogHead('Lumina · Catálogo de cosmética','Cosmética para el cuidado del rostro, cuerpo, cabello y labios.')});
