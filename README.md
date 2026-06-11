# Capacitor TypeORM SQLite Schematics

Angular 22 schematics for adding a Capacitor 8 + TypeORM 1.0.0 + SQLite architecture to an application.

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

Run publish and packaging commands from this project root:

```powershell
cd C:\Users\ChenYu\Desktop\capacitor-typeorm-sqlite-ng
```

The root directory must contain:

```txt
package.json
schematics/
tsconfig.schematics.json
README.md
```

Build and inspect the package before publishing:

```bash
npm login
npm whoami
npm run schematics:build
npm pack --dry-run
```

Publish the current release candidate:

```bash
npm publish --tag rc
```

Create a local tarball for testing:

```bash
npm pack
```

Install the infrastructure into another Angular project from npm:

```bash
ng add capacitor-typeorm-sqlite-ng@rc --databaseName transaction
```

Install from a local tarball before publishing:

```bash
ng add ./capacitor-typeorm-sqlite-ng-1.0.0-rc.1.tgz --databaseName transaction
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

## Troubleshooting

If Angular reports that it cannot find declarations for `sql.js`, make sure the target project has installed the dependencies written by `ng-add`:

```bash
npm install
```

The generated package.json should include:

```json
"devDependencies": {
  "@types/sql.js": "^1.4.9"
}
```

If the browser reports `GET /assets/sql-wasm-browser.wasm 404`, the target Angular app is not copying the wasm files from the right `node_modules` directory. The schematic writes asset entries for common layouts:

```json
{
  "glob": "sql-wasm*.wasm",
  "input": "node_modules/sql.js/dist",
  "output": "/assets"
}
```

For npm workspace apps nested under `apps/<name>`, the useful entry is usually:

```json
{
  "glob": "sql-wasm*.wasm",
  "input": "../../node_modules/sql.js/dist",
  "output": "/assets"
}
```

## Android

Sync Android assets with:

```bash
npm run cap:android
```

After native-impacting changes, verify that Android assets do not contain `sql-wasm.wasm`.
