# N'apsak? Gençlik Topluluğu Web Platformu

Bu proje, N'apsak? Gençlik Topluluğu platformunun frontend ve backend mimarisine uygun monorepo projesidir.

## Proje Yapısı

```
Napsak/
├── frontend/          # Next.js 14 Frontend Uygulaması
│   ├── src/           # Uygulama kaynak kodları (App Router, Components, vs.)
│   ├── public/        # Statik dosyalar ve görseller
│   ├── package.json   # Frontend bağımlılıkları ve komutları
│   └── next.config.mjs
│
├── backend/           # Gelecekte eklenecek Backend Servisleri
│   └── .gitkeep
│
├── .gitignore
└── README.md
```

## Geliştirme (Development)

Frontend uygulamasını çalıştırmak için:

```bash
cd frontend
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Üretim Derlemesi (Build & Type Check)

```bash
cd frontend
npx tsc --noEmit
npm run build
```
