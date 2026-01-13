# CarCare Warehouse - Frontend

Vue.js baserad SPA för lagerhanterings system. Gränssnittet låter lagerpersonal hantera produkter, kategorier och lagersaldo

## Tekniker

- **Vue.js 3** – Frontend ramverk
- **Vue Router** – SPA routing
- **Bootstrap 5** – CSS ramverk
- **Vite** – Build tool

## Installation & Start

### Förutsättningar
- Node.js (v16+)
- Backend API körs på `http://localhost:3000`

### Installera beroenden
```bash
npm install
```

### Starta utvecklingsserver
```bash
npm run dev
```

Appen körs på `http://localhost:5173`

### Build för produktion
```bash
npm run build
```

## Konfiguration

### API-proxy
Vite är konfigurerat att proxya `/api/*` till backend:
```
http://localhost:5173/api/... → http://localhost:3000/...
```

#### Login (`/`)
- Email + lösenord inloggning
- JWT token sparas i localstorage
- Validering av inmatning
- Test konto: `admin@carcare.se` / `test123`