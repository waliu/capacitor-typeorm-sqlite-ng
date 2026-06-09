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
npm run schematics:build
npm test -- --watch=false
npm run cap:android
```

Use `npm run build` for the browser build. Use `npm run build:native` before syncing Capacitor.

## TypeORM Patch

`npm install` runs `npm run typeorm:patch`.

The patch script updates TypeORM/sql.js browser and Capacitor compatibility points required by this project. It is intentionally strict: if an upstream file changes and the expected source cannot be found, the script fails instead of silently continuing.

## Schematics

Build the schematics before packing or publishing:

```bash
npm run schematics:build
npm pack
```

Install the infrastructure into another Angular project:

```bash
ng add ./capacitor-typeorm-sqlite-ng-0.0.0.tgz --databaseName transaction
```

Generate a new domain slice:

```bash
ng generate capacitor-typeorm-sqlite-ng:domain user
```

The `ng-add` schematic:

- Adds TypeORM/Capacitor/sql.js dependencies and scripts.
- Configures Angular web/native assets.
- Copies reusable `src/app/typeorm/` infrastructure.
- Creates `src/app/database/database.config.ts`.
- Wires `provideDatabase(appDatabaseOptions)` into `src/app/app.config.ts` when possible.

The `domain` schematic creates the portable services layer, TypeORM entity/adapter, and focused composition provider for one domain.

## Android

Sync Android assets with:

```bash
npm run cap:android
```

After native-impacting changes, verify that Android assets do not contain `sql-wasm.wasm`.
