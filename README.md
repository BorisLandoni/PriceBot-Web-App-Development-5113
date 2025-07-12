# PriceBot Web Application

PriceBot è un'applicazione web moderna che permette di monitorare automaticamente i prezzi dei prodotti online e ricevere notifiche quando raggiungono il prezzo desiderato.

## 🚀 Funzionalità

### Homepage Pubblica
- **Landing page accattivante**: Spiega cos'è PriceBot e i suoi benefici
- **Design responsive**: Ottimizzata per desktop e mobile
- **Call-to-action chiare**: Invita gli utenti a registrarsi

### Sistema di Autenticazione
- **Registrazione sicura**: Integrata con Supabase
- **Login/Logout**: Sistema completo di gestione sessioni
- **Password reset**: Recupero password via email

### Dashboard Utente (Protetta)
- **Lista prodotti monitorati**: Visualizza URL, prezzo attuale, prezzo obiettivo
- **Gestione prodotti**: Aggiungi, modifica, elimina prodotti
- **Statistiche**: Cards con metriche importanti
- **Grafici prezzi**: Visualizzazione trend con Recharts
- **Notifiche stato**: Sistema di alert per cambiamenti prezzo

### Integrazione Backend
- **API Client**: Configurato per collegarsi al backend Python
- **Gestione errori**: Handling completo degli errori API
- **Dati mock**: Funziona anche senza backend per demo

## 🛠 Stack Tecnologico

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animazioni**: Framer Motion
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Auth & Database**: Supabase
- **Icons**: React Icons (Feather)
- **Notifications**: React Hot Toast

## 📦 Installazione

1. **Clona il repository**
```bash
git clone <your-repo-url>
cd pricebot-webapp
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura le variabili d'ambiente**
```bash
cp .env.example .env
```

Modifica il file `.env` con le tue configurazioni:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

4. **Avvia il server di sviluppo**
```bash
npm run dev
```

## 🗄 Configurazione Database (Supabase)

### Schema delle tabelle necessarie:

```sql
-- Tabella utenti (gestita automaticamente da Supabase Auth)

-- Tabella prodotti
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  current_price DECIMAL(10,2),
  target_price DECIMAL(10,2) NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'monitoring',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella cronologia prezzi
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella notifiche
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella impostazioni notifiche utente
CREATE TABLE user_notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT TRUE,
  telegram_enabled BOOLEAN DEFAULT FALSE,
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  telegram_chat_id TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS (Row Level Security) Policies:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid() = user_id);

-- Price history policies
CREATE POLICY "Users can view price history for own products" ON price_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM products WHERE products.id = price_history.product_id AND products.user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON user_notification_settings FOR ALL USING (auth.uid() = user_id);
```

## 🔌 Integrazione Backend

L'applicazione è configurata per integrarsi con un backend Python esistente. Il client API in `src/lib/api.js` gestisce:

- **Autenticazione**: Headers automatici con token Supabase
- **Gestione errori**: Handling completo degli errori HTTP
- **Endpoints**: Tutti gli endpoint necessari per CRUD prodotti

### Endpoints Backend richiesti:

```python
# Prodotti
GET    /products?user_id={user_id}           # Lista prodotti utente
POST   /products                             # Crea nuovo prodotto
PUT    /products/{product_id}                # Aggiorna prodotto
DELETE /products/{product_id}                # Elimina prodotto

# Cronologia prezzi
GET    /products/{product_id}/price-history  # Cronologia prezzi

# Notifiche
GET    /notifications?user_id={user_id}      # Lista notifiche utente
PUT    /users/{user_id}/notification-settings # Aggiorna impostazioni

# Health check
GET    /health                               # Controllo stato API
```

## 🎨 Struttura del Progetto

```
src/
├── components/
│   ├── auth/                 # Componenti autenticazione
│   ├── common/               # Componenti riutilizzabili
│   └── dashboard/            # Componenti dashboard
├── contexts/                 # Context providers
├── lib/                      # Utilities e configurazioni
├── pages/                    # Pagine principali
└── common/                   # Componenti base (SafeIcon)
```

## 🔧 Configurazioni Disponibili

### Scripts NPM
- `npm run dev` - Avvia server di sviluppo
- `npm run build` - Build per produzione
- `npm run preview` - Anteprima build produzione
- `npm run lint` - Controllo codice con ESLint

### Variabili d'ambiente
- `VITE_SUPABASE_URL` - URL progetto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chiave anonima Supabase
- `VITE_API_BASE_URL` - URL base API backend

## 🚀 Deploy

### Vercel (Raccomandato)
1. Connetti repository GitHub a Vercel
2. Configura variabili d'ambiente nel dashboard Vercel
3. Deploy automatico ad ogni push

### Netlify
1. Connetti repository a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configura variabili d'ambiente

## 🔐 Sicurezza

- **Row Level Security**: Implementata su Supabase
- **Validazione input**: React Hook Form con validazioni
- **Sanitizzazione URL**: Controlli pattern per URL prodotti
- **Headers sicuri**: CORS e CSP configurati

## 📱 Notifiche Future

Il sistema è predisposto per supportare:
- **Email**: Tramite Supabase Edge Functions
- **Telegram**: Bot API integration
- **WhatsApp**: Business API integration
- **Push notifications**: Service Workers

## 🤝 Contribuire

1. Fork del repository
2. Crea branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## 📞 Supporto

Per supporto e domande:
- Apri una issue su GitHub
- Contatta via email: support@pricebot.com

---

**PriceBot** - Il tuo assistente intelligente per monitorare i prezzi online 🤖💰