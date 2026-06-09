You are an expert in TypeScript, Angular, Capacitor, and TypeORM. Write maintainable code that follows the project architecture below.

## TypeScript Rules

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid `any`; use `unknown` when a type is uncertain.
- Keep pure business classes framework-free and easy to instantiate in tests.

## Angular Rules

- Use standalone components. Do not set `standalone: true`; Angular v20+ treats it as the default.
- Use signals for local UI state.
- Use `computed()` for derived signal state.
- Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives.
- Use `input()` and `output()` functions instead of decorators.
- Do not use `ngClass`; use `class` bindings.
- Do not use `ngStyle`; use `style` bindings.
- Prefer lazy feature routes.
- Keep components small and focused on UI orchestration.
- When using external templates/styles, use paths relative to the component TypeScript file.
- Use `provideAppInitializer()` for app startup initialization, not component lifecycle hooks.

## Accessibility Rules

- UI work must follow WCAG AA basics: usable focus states, sufficient contrast, semantic markup, and clear labels.
- Use `aria-live` for dynamic status/list updates when users need feedback.

## Project Architecture

This project uses Ports and Adapters. Keep this dependency direction:

```txt
features/
  -> services/controllers
  -> services/services
  -> services/repositories interface
  -> database/repositories adapter
  -> typeorm/repositories provider
  -> TypeORM Repository
  -> DatabaseService / DataSource
```

## Directory Responsibilities

- `src/app/features/` is the Angular UI layer. It owns pages, components, UI state, route interaction, loading state, and display-only concerns.
- `src/app/services/` is the portable business layer. It owns DTOs, pure business entities, repository interfaces, business services, and application controllers.
- `src/app/typeorm/` is the reusable TypeORM/Capacitor adapter layer. It owns DataSource creation, platform/database providers, repository tokens, and generic repository providers.
- `src/app/database/` is the current app database layer. It owns `database.config.ts`, app-specific TypeORM entities, app-specific migrations, and app-specific TypeORM repository adapters grouped by domain.
- `src/app/composition/` is the Angular composition root. It wires interfaces to adapters through Angular providers and delegates domain-specific wiring to focused provider files.
- `src/app/shared/` is for small cross-cutting UI/app contracts, such as read-only tokens used by features.

## Hard Boundaries

- `services/` must not import Angular, Ionic, Capacitor, or TypeORM packages.
- `features/` must not import `typeorm/`, TypeORM `Repository`, TypeORM `DataSource`, or concrete repository adapters.
- `features/` may call application controllers and use Angular UI APIs.
- Business controllers must not initialize the database, expose platform details, or reach into `DatabaseService`.
- Business services must depend on repository interfaces, not TypeORM repositories or DataSource objects.
- Repository interfaces should use business input/model types, not UI/controller DTOs, when the service needs to validate or normalize data first.
- Business entities under `services/entities/` must be pure TypeScript shapes/classes without persistence decorators.
- TypeORM entities must live under `database/entities/`, not under `services/entities/`.
- App-specific TypeORM repository adapters must live under `database/repositories/`, implement business repository interfaces, map TypeORM entities to business entities, and may depend on TypeORM `Repository<TEntity>`.
- Group database entities and repository adapters by domain once more than one domain exists, for example `database/entities/user/` and `database/repositories/user/`.
- Keep `application.providers.ts` small; add domain provider files such as `composition/user.providers.ts` for domain-specific wiring.
- `typeorm/` must not import app business modules from `services/` or `database/`.
- `typeorm/` infrastructure objects such as platform detection, SQLite connections, and DataSource factories should be provided through Angular injection tokens instead of being created directly inside services.
- Database initialization must happen through `provideDatabase(...)` and `provideAppInitializer(...)`, not inside pages, controllers, services, or repositories.
- Project migrations must live under `src/app/database/migrations/`, not under `src/app/typeorm/`.
- Project entity/migration registration must live in `src/app/database/database.config.ts`.
- In Angular/browser code, import TypeORM APIs from `typeorm/browser` unless there is a clear reason not to.

## Reuse And Schematics Strategy

- Treat `typeorm/` as code that can later move into a shared adapter library or be emitted by a schematic.
- Treat `database/` as target-project code generated or updated by a schematic, including app-specific migrations and concrete repository adapters.
- Treat `services/` as the code most likely to move to a future Node.js backend with minimal changes; keep it independent from browser TypeORM imports.
- A future backend should replace `database/`, `typeorm/`, `composition/`, and `features/`, while reusing the business contracts and logic in `services/`.

## Adding A New Domain Module

- Add DTOs under `services/dto/<domain>/`.
- Add pure business entities under `services/entities/<domain>/`.
- Add repository interfaces under `services/repositories/<domain>/`.
- Add business services under `services/services/<domain>/`.
- Add application controllers under `services/controllers/<domain>/`.
- Add TypeORM entities under `database/entities/<domain>/`.
- Add concrete TypeORM adapters under `database/repositories/<domain>/`.
- Register entities and migrations in `database/database.config.ts`.
- Wire repository interfaces to concrete adapters in a focused domain provider file under `composition/`, then compose it from `composition/application.providers.ts`.
- Keep feature pages under `features/<domain>/` and call controllers only.

## Verification

- Run `npm run build` for the web build.
- Run `npm run build:native` and confirm native output does not include `sql-wasm.wasm`.
- Run `npm test -- --watch=false`.
- Run `npm run cap:android` after native-impacting changes.
- Check boundaries with:

```powershell
rg "@angular|@ionic|@capacitor|typeorm" src\app\services
rg "repositories|typeorm|DataSource|Repository" src\app\features
```

Both commands should return no matches.
