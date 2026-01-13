# Clean Architecture - SIPeIP

Documentación de la migración a Clean Architecture del proyecto SIPeIP.

## Estado Actual

| Fase | Estado | Descripción |
|------|--------|-------------|
| Fase 1 | Completada | Fundamentos (clases base, errores, interfaces) |
| Fase 2 | Completada | Migración piloto - Institution |
| Fase 3 | Completada | Entidades simples (InstitutionalPlan, ProjectGoal, Project, Program) |
| Fase 4 | Completada | Entidades complejas (Person, User con PasswordService) |
| Fase 5 | Completada | Servicios de infraestructura (JWTService) |
| Fase 6 | Pendiente | Entidades de planificación |
| Fase 7 | Pendiente | RBAC (Role, Permission) |
| Fase 8 | Pendiente | Limpieza final |

---

## Estructura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION                              │
│  (GraphQL Resolvers - schema/pothos/types/)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION                               │
│  (Use Cases, DTOs, Mappers)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN                                  │
│  (Entidades, Repository Interfaces, Service Interfaces)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                              │
│  (Drizzle Repositories, Services, UnitOfWork)               │
└─────────────────────────────────────────────────────────────┘
```

| Capa | Responsabilidad | Dependencias |
|------|-----------------|--------------|
| **Domain** | Entidades ricas, reglas de negocio, interfaces | Ninguna (capa pura) |
| **Application** | Casos de uso, orquestación, DTOs, mappers | Domain |
| **Infrastructure** | Implementaciones de repositorios, servicios | Domain, Application |
| **Presentation** | Resolvers GraphQL | Application |

---

## Archivos Creados

### packages/shared/src/ (Fundamentos)

```
domain/
├── entities/common/
│   ├── Entity.ts            # Clase base para entidades
│   └── ValueObject.ts       # Clase base para value objects
├── errors/
│   ├── DomainError.ts       # Error base de dominio
│   ├── NotFoundError.ts
│   └── ValidationError.ts
└── ports/
    ├── IRepository.ts       # Interface base de repositorio
    └── IUnitOfWork.ts       # Interface para transacciones

application/
└── UseCase.ts               # Interface base para casos de uso
```

### packages/api/src/domain/ (Capa Dominio)

```
entities/
├── Institution.ts
├── InstitutionalPlan.ts
├── Program.ts
├── Project.ts
├── ProjectGoal.ts
├── Person.ts
└── User.ts

repositories/
├── IInstitutionRepository.ts
├── IInstitutionalPlanRepository.ts
├── IProgramRepository.ts
├── IProjectRepository.ts
├── IProjectGoalRepository.ts
├── IPersonRepository.ts
└── IUserRepository.ts

services/
└── IJWTService.ts
```

### packages/api/src/infrastructure/ (Capa Infraestructura)

```
persistence/drizzle/
├── DrizzleUnitOfWork.ts
├── mappers/
│   ├── InstitutionPersistenceMapper.ts
│   ├── InstitutionalPlanPersistenceMapper.ts
│   ├── ProgramPersistenceMapper.ts
│   ├── ProjectPersistenceMapper.ts
│   ├── ProjectGoalPersistenceMapper.ts
│   ├── PersonPersistenceMapper.ts
│   └── UserPersistenceMapper.ts
└── repositories/
    ├── DrizzleInstitutionRepository.ts
    ├── DrizzleInstitutionalPlanRepository.ts
    ├── DrizzleProgramRepository.ts
    ├── DrizzleProjectRepository.ts
    ├── DrizzleProjectGoalRepository.ts
    ├── DrizzlePersonRepository.ts
    └── DrizzleUserRepository.ts

services/
├── PasswordService.ts
└── JWTService.ts
```

### packages/api/src/application/ (Capa Aplicación)

```
dto/
├── institution/
│   ├── CreateInstitutionDTO.ts
│   ├── UpdateInstitutionDTO.ts
│   ├── InstitutionResponseDTO.ts
│   └── index.ts
├── institutional-plan/
├── program/
├── project/
├── project-goal/
├── person/
└── user/

mappers/
├── InstitutionMapper.ts
├── InstitutionalPlanMapper.ts
├── ProgramMapper.ts
├── ProjectMapper.ts
├── ProjectGoalMapper.ts
├── PersonMapper.ts
├── UserMapper.ts
└── index.ts

use-cases/
├── institution/
│   ├── CreateInstitution.ts
│   ├── UpdateInstitution.ts
│   ├── ListInstitutions.ts
│   ├── GetInstitutionById.ts
│   └── index.ts
├── institutional-plan/
├── program/
├── project/
├── project-goal/
└── user/
```

### packages/api/src/di/ (Inyección de Dependencias)

```
├── Container.ts
└── types.ts
```

---

## Código Legacy Deprecado

Estos archivos tienen el comentario `@deprecated` y serán eliminados en el futuro:

- `helpers/hashAndSaltFromPassword.ts`
- `helpers/session/SessionManager.ts`
- `helpers/session/JWTSigner.ts`
- `helpers/session/UserPasswordManager.ts`
- `helpers/session/User.session.ts`

---

## Patrones Implementados

### 1. Entity Base Class

```typescript
// packages/shared/src/domain/entities/common/Entity.ts
export abstract class Entity {
  protected constructor(
    private readonly _uid: string,
    private readonly _createdBy: string,
    private readonly _createdAt: Date,
  ) {}

  protected markUpdated(updatedBy: string): void {
    this._updatedBy = updatedBy
    this._updatedAt = new Date()
  }

  equals(other: Entity): boolean {
    return this._uid === other._uid
  }
}
```

### 2. Rich Domain Entity

```typescript
// domain/entities/Institution.ts
export class Institution extends Entity {
  private constructor(/* ... */) {
    super(uid, String(createdBy), createdAt)
  }

  // Factory para crear nueva
  static create(props: CreateInstitutionProps): Institution {
    Institution.validateName(props.name)
    return new Institution(/* ... */)
  }

  // Factory para reconstruir desde BD
  static reconstitute(props: InstitutionProps): Institution {
    return new Institution(/* ... */)
  }

  // Comportamiento de dominio
  updateName(name: string, updatedBy: number): void {
    Institution.validateName(name)
    this._name = name
    this.markUpdated(String(updatedBy))
  }

  // Validaciones de dominio
  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError('El nombre debe tener al menos 3 caracteres', 'name')
    }
  }
}
```

### 3. Repository Interface

```typescript
// domain/repositories/IInstitutionRepository.ts
export interface IInstitutionRepository {
  findById(id: number): Promise<Institution | null>
  findByUid(uid: string): Promise<Institution | null>
  findMany(options?: FindManyOptions): Promise<Institution[]>
  save(institution: Institution): Promise<Institution>
  delete(id: number): Promise<void>
}
```

### 4. Use Case

```typescript
// application/use-cases/institution/CreateInstitution.ts
export class CreateInstitution implements IUseCase<CreateInstitutionDTO, InstitutionResponseDTO> {
  constructor(
    private deps: { institutionRepository: IInstitutionRepository }
  ) {}

  async execute(input: CreateInstitutionDTO, actorId: number): Promise<InstitutionResponseDTO> {
    const institution = Institution.create({
      name: input.name,
      area: input.area,
      level: input.level,
      createdBy: actorId,
    })

    const saved = await this.deps.institutionRepository.save(institution)
    return InstitutionMapper.toResponseDTO(saved)
  }
}
```

### 5. Container (Dependency Injection)

```typescript
// di/Container.ts
export class Container {
  private instances = new Map<symbol, unknown>()

  constructor(private db: Db) {
    this.registerRepositories()
    this.registerServices()
    this.registerUseCases()
  }

  get<T>(token: symbol): T {
    const instance = this.instances.get(token)
    if (!instance) {
      throw new Error(`Dependency not registered: ${token.toString()}`)
    }
    return instance as T
  }
}

// Cache por conexión DB (evita memory leaks en Workers)
const containerCache = new WeakMap<Db, Container>()

export function getContainer(db: Db): Container {
  if (!containerCache.has(db)) {
    containerCache.set(db, new Container(db))
  }
  return containerCache.get(db)!
}
```

---

## Cómo Agregar una Nueva Entidad

Para migrar una nueva entidad (ej: `InstitutionalClassification`), sigue estos pasos:

### 1. Crear la Entidad de Dominio

```bash
# Crear archivo
touch packages/api/src/domain/entities/InstitutionalClassification.ts
```

```typescript
import { Entity } from '@sigep/shared'
import { ValidationError } from '@sigep/shared'

export interface CreateInstitutionalClassificationProps {
  name: string
  code: string
  createdBy: number
}

export interface InstitutionalClassificationProps {
  id: number
  uid: string
  name: string
  code: string
  active: boolean
  createdBy: number
  createdAt: Date
  updatedBy?: number
  updatedAt?: Date
}

export class InstitutionalClassification extends Entity {
  // Implementar siguiendo el patrón de Institution
}
```

### 2. Crear Interface del Repositorio

```bash
touch packages/api/src/domain/repositories/IInstitutionalClassificationRepository.ts
```

```typescript
import type { InstitutionalClassification } from '../entities/InstitutionalClassification'

export interface IInstitutionalClassificationRepository {
  findById(id: number): Promise<InstitutionalClassification | null>
  findByUid(uid: string): Promise<InstitutionalClassification | null>
  findMany(): Promise<InstitutionalClassification[]>
  save(entity: InstitutionalClassification): Promise<InstitutionalClassification>
  delete(id: number): Promise<void>
}
```

### 3. Crear Persistence Mapper

```bash
touch packages/api/src/infrastructure/persistence/drizzle/mappers/InstitutionalClassificationPersistenceMapper.ts
```

### 4. Crear Repository

```bash
touch packages/api/src/infrastructure/persistence/drizzle/repositories/DrizzleInstitutionalClassificationRepository.ts
```

### 5. Crear DTOs

```bash
mkdir -p packages/api/src/application/dto/institutional-classification
touch packages/api/src/application/dto/institutional-classification/CreateInstitutionalClassificationDTO.ts
touch packages/api/src/application/dto/institutional-classification/UpdateInstitutionalClassificationDTO.ts
touch packages/api/src/application/dto/institutional-classification/InstitutionalClassificationResponseDTO.ts
touch packages/api/src/application/dto/institutional-classification/index.ts
```

### 6. Crear Mapper de Aplicación

```bash
touch packages/api/src/application/mappers/InstitutionalClassificationMapper.ts
```

### 7. Crear Use Cases

```bash
mkdir -p packages/api/src/application/use-cases/institutional-classification
touch packages/api/src/application/use-cases/institutional-classification/CreateInstitutionalClassification.ts
touch packages/api/src/application/use-cases/institutional-classification/UpdateInstitutionalClassification.ts
touch packages/api/src/application/use-cases/institutional-classification/ListInstitutionalClassifications.ts
touch packages/api/src/application/use-cases/institutional-classification/GetInstitutionalClassificationById.ts
touch packages/api/src/application/use-cases/institutional-classification/index.ts
```

### 8. Registrar en Container

Agregar en `di/types.ts`:
```typescript
export const INSTITUTIONAL_CLASSIFICATION_REPOSITORY = Symbol('InstitutionalClassificationRepository')
export const CREATE_INSTITUTIONAL_CLASSIFICATION = Symbol('CreateInstitutionalClassification')
// ... etc
```

Agregar en `di/Container.ts`:
```typescript
// En registerRepositories()
this.instances.set(
  INSTITUTIONAL_CLASSIFICATION_REPOSITORY,
  new DrizzleInstitutionalClassificationRepository(this.db),
)

// En registerUseCases()
this.instances.set(
  CREATE_INSTITUTIONAL_CLASSIFICATION,
  new CreateInstitutionalClassification({ institutionalClassificationRepository }),
)
```

### 9. Actualizar Resolvers (opcional)

Si deseas usar los use cases en los resolvers GraphQL:

```typescript
// schema/pothos/types/mutations/institutional-classification.ts
resolve: async (_, { data }, { container, user }) => {
  const useCase = container.get<CreateInstitutionalClassification>(CREATE_INSTITUTIONAL_CLASSIFICATION)
  return useCase.execute(data, user.id)
}
```

---

## Fases Pendientes

### Fase 6: Entidades del Dominio de Planificación
- `InstitutionalClassification`
- `StrategicObjective`
- `Goal` (Meta)
- `Indicator` (Indicador)
- Alineaciones OE-PND-ODS

### Fase 7: RBAC
- `Role`
- `Permission`
- `UserRole`
- Integrar con autorización de Pothos

### Fase 8: Limpieza Final
- Eliminar carpeta `models/` (ya no se usa)
- Eliminar `services/UserPerson.service.ts`
- Eliminar archivos deprecados en `helpers/session/`
- Actualizar imports

---

## Notas Técnicas

- **Cloudflare Workers**: No soporta decoradores ni IoC tradicional. Usamos Factory pattern.
- **Drizzle ORM**: Transacciones se manejan con callbacks. El UnitOfWork se adapta a este patrón.
- **Pothos**: Los types existentes se mantienen. Solo cambian los resolvers.
- **WeakMap para Container**: Evita memory leaks en Workers, cachea por conexión DB.
- **Lazy initialization**: JWTService inicializa las claves JWT de forma lazy (requerido por Workers).
