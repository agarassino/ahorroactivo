# Ahorro Activo - Landing Page

## Descripción
Landing page para Ahorro Activo, una app fintech que permite invertir de forma automática y recurrente en el Merval (Bolsa de Buenos Aires).

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Repo**: https://github.com/agarassino/ahorroactivo

## URLs
- **Producción**: https://ahorroactivo.vercel.app
- **Admin**: https://ahorroactivo.vercel.app/admin
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cmwbrhatnkjqwqljvifn

## Estructura del Proyecto
```
ahorroactivo/
├── src/
│   ├── App.tsx          # Landing page (carga contenido de Supabase)
│   ├── Admin.tsx        # Panel de administración
│   ├── main.tsx         # Entry point + routing
│   ├── index.css        # Tailwind config + colores de marca
│   └── lib/
│       ├── supabase.ts  # Cliente de Supabase
│       └── content.ts   # Funciones para contenido y logo
├── public/
├── index.html           # HTML base + Montserrat font
├── vite.config.ts       # Config de Vite + Tailwind plugin
├── vercel.json          # Rewrites para SPA routing
├── .env                 # Variables de entorno (local)
└── package.json
```

## Admin Panel
- **URL**: https://ahorroactivo.vercel.app/admin
- **Password**: `ahorroactivo2024`
- **Funcionalidades**:
  - Editar todos los textos de la landing
  - Subir logo (se guarda en Supabase Storage)
  - Los cambios se reflejan inmediatamente

## Colores de Marca
Definidos en `src/index.css`:
```css
--color-primary-dark: #163E70;   /* Azul oscuro - textos, header */
--color-primary: #37AAE1;        /* Azul claro - CTAs, acentos */
--color-secondary: #81CBDB;      /* Celeste - badges, iconos */
--color-background: #F4F5F6;     /* Gris claro - fondos */
--color-footer: #0D2A4D;         /* Azul muy oscuro - footer */
```

Uso en Tailwind: `bg-primary`, `text-primary-dark`, etc.

## Tipografía
- **Font**: Montserrat (Google Fonts)
- Cargada en `index.html`
- Configurada como `--font-sans` en Tailwind

## Supabase

### Credenciales
```
URL: https://cmwbrhatnkjqwqljvifn.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
(Hardcodeadas en `src/lib/supabase.ts` - la anon key es pública por diseño)

### Tabla: content
Almacena todos los textos editables de la landing.
```sql
create table content (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);
```

### Tabla: waitlist
```sql
create table waitlist (
  id bigint primary key generated always as identity,
  email text unique not null,
  created_at timestamp with time zone default now()
);

alter table waitlist enable row level security;

create policy "Allow anonymous inserts" on waitlist
  for insert with check (true);
```

### Ver emails registrados
En Supabase Dashboard → Table Editor → waitlist

## Secciones de la Landing
1. **Header** - Logo, navegación, CTA
2. **Hero** - Título, subtítulo, CTAs, mockup del teléfono
3. **Beneficios** - 3 cards (Automático, Sin complicaciones, Seguro)
4. **Cómo funciona** - 3 pasos numerados
5. **Waitlist** - Formulario de email para lista de espera
6. **FAQ** - 4 preguntas frecuentes con acordeón
7. **Footer** - Links y contacto

## Comandos

```bash
# Desarrollo local
npm run dev

# Build
npm run build

# Deploy a producción
npx vercel --prod --yes

# O simplemente pushear a main (auto-deploy)
git push origin main
```

## Cómo hacer cambios comunes

### Cambiar textos
Editar directamente en `src/App.tsx`. Buscar la sección correspondiente.

### Cambiar colores
Editar `src/index.css` en el bloque `@theme`.

### Agregar nueva sección
Agregar un nuevo `<section>` en `src/App.tsx` siguiendo el patrón existente.

### Ver emails de waitlist
1. Ir a https://supabase.com/dashboard
2. Seleccionar proyecto `cmwbrhatnkjqwqljvifn`
3. Table Editor → waitlist

### Exportar emails
En Supabase: Table Editor → waitlist → Export → CSV

## Notas
- El diseño original está en `/landing.pen` (archivo Pencil)
- La app usa scroll suave (`scroll-behavior: smooth` en CSS)
- El formulario maneja duplicados mostrando "Este email ya está en la lista"
