# Capacitor TypeORM SQLite Angular

Angular 22 + Capacitor 8 + TypeORM 1.0.0 demo project for a SQLite-backed mobile app.

The app keeps the browser build and native build separate:

- Web uses `sql.js` and copies `sql-wasm.wasm` into `/assets`.
- Native Android/iOS uses `@capacitor-community/sqlite` and does not copy `sql-wasm.wasm`.

## Architecture

The project follows Ports and Adapters.

```txt
features/
  -> services/controllers
  -> services/services
  -> services/repositories interface
  -> database/repositories/<domain> adapter
  -> typeorm/repositories provider
  -> TypeORM Repository
  -> DatabaseService / DataSource
```

Key boundaries:

- `src/app/services/` is portable business code. It must not import Angular, Ionic, Capacitor, or TypeORM.
- `src/app/features/` is Angular UI code. It calls controllers only.
- `src/app/database/` contains app-specific TypeORM entities, migrations, and repository adapters.
- `src/app/typeorm/` contains reusable TypeORM/Capacitor infrastructure. Platform detection, SQLite connection creation, and DataSource factory creation are exposed through providers so the adapter can later move into a shared library.
- `src/app/composition/` wires business interfaces to concrete adapters.

## Commands

```bash
npm run build
npm run build:native
npm test -- --watch=false
npm run cap:android
```

Use `npm run build` for the browser build. Use `npm run build:native` before syncing Capacitor.

## TypeORM Patch

`npm install` runs `npm run typeorm:patch`.

The patch script updates TypeORM/sql.js browser and Capacitor compatibility points required by this project. It is intentionally strict: if an upstream file changes and the expected source cannot be found, the script fails instead of silently continuing.

## Android

Sync Android assets with:

```bash
npm run cap:android
```

After native-impacting changes, verify that Android assets do not contain `sql-wasm.wasm`.
