# Implementation Plan: Simple NestJS Todo Server

**Date**: 2025-09-26
**Status**: Approved
**Type**: PLAN
**Links**:
  - Spec: [./spec.md](./spec.md)
  - Story: `.spec/stories/20250926-simple-nestjs-todo-server/`

## Priority Legend
🔴 **Critical** - Must have / Blocks progress
🟡 **Important** - Should have / Affects quality
🟢 **Optional** - Nice to have / Can use defaults

## 📋 Prerequisites
- ✅ [Specification](./spec.md) approved
- ✅ All 🔴 critical clarifications resolved
- ✅ Success metrics defined
- ✅ Test strategy agreed

## 1. Overview
Building a lightweight NestJS REST API server for todo management with in-memory SQLite storage. The server provides CRUD operations for todo items without authentication, designed for personal productivity tracking.

## 📊 Progress Status
| Stage  | Requirements | Design     | Implementation | Testing     |
| ------ | ------------ | ---------- | -------------- | ----------- |
| SPEC   | ✅ Complete   | ✅ Complete | -              | -           |
| PLAN   | ✅ Complete   | ✅ Complete | ⏳ Pending      | ⏳ Pending   |
| Status | Approved     | Approved   | Not Started    | Not Started |

## 2. Requirements & Clarifications

### 2.1 Spec Requirements Mapping
| Spec Requirement   | Implementation Approach                 | Phase   |
| ------------------ | --------------------------------------- | ------- |
| 🔴 FR-001 (POST)    | TodoController.create() + CreateTodoDto | Phase 2 |
| 🔴 FR-002 (IDs)     | TypeORM auto-increment primary key      | Phase 1 |
| 🔴 FR-003 (GET all) | TodoController.findAll()                | Phase 2 |
| 🔴 FR-004 (GET one) | TodoController.findOne()                | Phase 2 |
| 🔴 FR-005 (PUT)     | TodoController.update() + UpdateTodoDto | Phase 2 |
| 🔴 FR-006 (DELETE)  | TodoController.remove()                 | Phase 2 |
| 🔴 FR-007 (Schema)  | Todo entity with id, title, completed   | Phase 1 |
| 🔴 FR-009 (SQLite)  | TypeORM with :memory: database          | Phase 1 |
| 🔴 NFR-001 (Port)   | main.ts configuration port 3001         | Phase 1 |
| 🔴 NFR-002 (JSON)   | NestJS default JSON serialization       | Phase 1 |

### 2.2 Scope
- **In-scope**:
  - New NestJS application at `apps/api`
  - Todo CRUD REST endpoints
  - In-memory SQLite database
  - Basic error handling
  - Unit tests for service layer

- **Out-of-scope**:
  - Authentication/authorization
  - Frontend integration (no CORS)
  - Data persistence between restarts
  - Bulk operations
  - Advanced todo features (priorities, dates, etc.)

- **Impact**:
  - New app in monorepo structure
  - Updates to root package.json scripts
  - No changes to existing web app

### 2.3 Clarifications from Spec
- **Resolved Clarifications**:
  - [#001]: Todo structure → Minimal (id, title, completed only)
  - [#002]: Operations → Basic CRUD only
  - [#003]: Persistence → In-memory only, data lost on restart
  - [#004]: Frontend integration → Standalone server, no CORS needed

- **Technical Assumptions Made**:
  - Use TypeORM for future extensibility (based on NestJS standards)
  - DTOs for validation (based on NestJS patterns)
  - Port 3001 to avoid conflicts
  - No CORS configuration (truly standalone)

### 2.4 Technical Design

#### Architecture
```
apps/api/
├── src/
│   ├── todo/                 # Todo module
│   │   ├── entities/         # TypeORM entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── todo.controller.ts
│   │   ├── todo.service.ts
│   │   └── todo.module.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Bootstrap & config
├── test/                    # Tests
└── package.json
```

#### Data Model
```typescript
// Todo Entity
interface TodoEntity {
  id: number          // Auto-increment primary key
  title: string       // Required, non-empty
  completed: boolean  // Default: false
}
```

#### API Interfaces
```typescript
// REST Endpoints
interface TodoEndpoints {
  POST   /todos              // Create todo
  GET    /todos              // Get all todos
  GET    /todos/:id          // Get one todo
  PUT    /todos/:id          // Update todo
  DELETE /todos/:id          // Remove todo
}

// DTOs
interface CreateTodoDto {
  title: string  // @IsString() @IsNotEmpty()
}

interface UpdateTodoDto {
  title?: string      // @IsString() @IsOptional()
  completed?: boolean // @IsBoolean() @IsOptional()
}

// Service Interface
interface TodoService {
  create(dto: CreateTodoDto): Promise<Todo>
  findAll(): Promise<Todo[]>
  findOne(id: number): Promise<Todo>
  update(id: number, dto: UpdateTodoDto): Promise<Todo>
  remove(id: number): Promise<void>
}
```

### 2.5 Acceptance Criteria
- **Functional Tests**:
  - ✅ Server starts on port 3001
  - ✅ POST /todos creates new todo with auto-generated ID
  - ✅ GET /todos returns array of all todos
  - ✅ GET /todos/:id returns specific todo or 404
  - ✅ PUT /todos/:id updates todo fields
  - ✅ DELETE /todos/:id removes todo
  - ✅ Invalid requests return appropriate 400/404 errors

- **Performance**:
  - Response time < 100ms for all operations
  - Server startup < 5 seconds

- **Edge Cases**:
  - Empty title → 400 Bad Request
  - Non-existent ID → 404 Not Found
  - Invalid JSON → 400 Bad Request
  - Server restart → Empty todo list

## 3. Implementation Tasks

### Phase 1: Project Setup & Database
**Implements**: FR-002, FR-007, FR-009, NFR-001, NFR-002

#### Implementation
- [ ] Initialize NestJS project at `apps/api`
  - **Command**: `pnpm dlx @nestjs/cli new api --directory apps/api --package-manager pnpm`
  - **Configure**: Set port 3001 in main.ts

- [ ] Configure TypeORM with in-memory SQLite
  - **Key Files**: `apps/api/src/app.module.ts`
  - **Dependencies**: `@nestjs/typeorm typeorm sqlite3`
  - **Configuration**:
    ```typescript
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Todo],
      synchronize: true, // Auto-create tables
    })
    ```

- [ ] Create Todo entity
  - **Key Files**: `apps/api/src/todo/entities/todo.entity.ts`
  - **Schema**:
    ```typescript
    @Entity()
    class Todo {
      @PrimaryGeneratedColumn()
      id: number

      @Column()
      title: string

      @Column({ default: false })
      completed: boolean
    }
    ```

#### Test Plan
- **Test Approach**: Verify database setup and entity
- **Test Cases**:
  - [ ] App module imports TypeORM correctly
  - [ ] Todo entity has correct columns
  - [ ] Database connection establishes
- **Validation Criteria**: App starts without errors
- **Rollback Point**: Remove apps/api if setup fails

### Phase 2: Todo CRUD Operations
**Implements**: FR-001, FR-003, FR-004, FR-005, FR-006, FR-010

#### Implementation
- [ ] Create Todo module structure
  - **Key Files**:
    - `apps/api/src/todo/todo.module.ts`
    - `apps/api/src/todo/todo.controller.ts`
    - `apps/api/src/todo/todo.service.ts`

- [ ] Implement DTOs with validation
  - **Key Files**:
    - `apps/api/src/todo/dto/create-todo.dto.ts`
    - `apps/api/src/todo/dto/update-todo.dto.ts`
  - **Validation**: class-validator decorators

- [ ] Implement TodoService with TypeORM
  - **Operations**: CRUD methods using Repository pattern
  - **Error Handling**: NotFoundException for missing IDs

- [ ] Implement TodoController endpoints
  - **Routes**: RESTful /todos endpoints
  - **Decorators**: @Get(), @Post(), @Put(), @Delete()
  - **Pipes**: ValidationPipe for DTO validation

#### Test Plan
- **Test Approach**: Unit tests for service, E2E for endpoints
- **Test Cases**:
  - [ ] Service creates todo with auto ID
  - [ ] Service throws NotFoundException for invalid ID
  - [ ] Controller validates empty title
  - [ ] All CRUD endpoints return correct status codes
- **Validation Criteria**: All endpoints work via HTTP client
- **Rollback Point**: Revert todo module changes

### Phase 3: Error Handling & Validation
**Implements**: NFR-005, NFR-006

#### Implementation
- [ ] Configure global validation pipe
  - **Key Files**: `apps/api/src/main.ts`
  - **Configuration**:
    ```typescript
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }))
    ```

- [ ] Add logging for errors
  - **Key Files**: `apps/api/src/todo/todo.service.ts`
  - **Approach**: NestJS Logger for error cases

- [ ] Handle edge cases
  - **Invalid JSON**: Global exception filter
  - **Not Found**: Built-in NotFoundException
  - **Validation Errors**: ValidationPipe response

#### Test Plan
- **Test Approach**: Test error scenarios
- **Test Cases**:
  - [ ] POST with empty title returns 400
  - [ ] GET/PUT/DELETE with invalid ID returns 404
  - [ ] Malformed JSON returns 400
  - [ ] Server logs errors to console
- **Validation Criteria**: Proper error responses
- **Rollback Point**: Remove error handling if issues

### Phase 4: Testing & Documentation
**Implements**: Test coverage and basic setup docs

#### Implementation
- [ ] Write unit tests for TodoService
  - **Key Files**: `apps/api/src/todo/todo.service.spec.ts`
  - **Coverage**: All CRUD operations

- [ ] Add npm scripts to root package.json
  - **Scripts**:
    ```json
    {
      "api:dev": "pnpm --filter api start:dev",
      "api:build": "pnpm --filter api build",
      "api:test": "pnpm --filter api test"
    }
    ```

- [ ] Create basic README
  - **Key Files**: `apps/api/README.md`
  - **Content**: How to run, test, and use the API

#### Test Plan
- **Test Approach**: Run full test suite
- **Test Cases**:
  - [ ] Unit tests pass
  - [ ] npm scripts work from root
  - [ ] Server starts and accepts requests
- **Validation Criteria**: >80% code coverage
- **Rollback Point**: Fix failing tests

## 4. File Changes Summary

### Key Files by Category
| Category        | Pattern/Location               | Purpose                    | Priority  |
| --------------- | ------------------------------ | -------------------------- | --------- |
| 🔴 Core Logic    | `apps/api/src/todo/*.ts`       | Todo module implementation | Critical  |
| 🔴 Entity        | `apps/api/src/todo/entities/*` | Database schema            | Critical  |
| 🔴 DTOs          | `apps/api/src/todo/dto/*`      | Validation & contracts     | Critical  |
| 🟡 Configuration | `apps/api/src/*.module.ts`     | Module setup               | Important |
| 🟡 Bootstrap     | `apps/api/src/main.ts`         | Server configuration       | Important |
| 🟢 Tests         | `apps/api/src/**/*.spec.ts`    | Unit tests                 | Required  |
| ℹ️ Config        | `apps/api/package.json`        | Dependencies               | Required  |

**Note**: Only major files listed. Implementation may touch additional NestJS generated files.

## 5. Validation & Human Review

### Pre-Review Checklist (AI Validation)
- [x] All spec requirements mapped to implementation phases
- [x] Test plans integrated with each phase
- [x] Interfaces clearly defined without implementation details
- [x] Rollback strategies documented for each phase
- [x] Key files identified (not exhaustive)
- [x] No [PLACEHOLDER] or ambiguous sections remain

### Implementation Order
1. Phase 1: Project Setup & Database (Day 1)
2. Phase 2: Todo CRUD Operations (Day 1)
3. Phase 3: Error Handling & Validation (Day 1)
4. Phase 4: Testing & Documentation (Day 1)

Total estimated time: 2-3 hours for complete implementation

### Human Review Request
```markdown
## 🔍 Ready for Human Review

The implementation plan for Simple NestJS Todo Server is complete.

**Technical Decisions Made:**
- Location: `apps/api` following monorepo convention
- Database: TypeORM with in-memory SQLite
- Validation: DTOs with class-validator
- No CORS (standalone server per spec)
- Basic unit tests with Jest

**Please review:**
1. Technical approach and architecture decisions
2. Phase breakdown and task sequencing
3. Test coverage and validation criteria
4. Any missing requirements or edge cases

**Your Options:**
- ✅ Type "approve" to proceed with implementation
- 💭 Provide feedback or request changes
- ❓ Ask for clarification on specific sections
```

### Status Progression
| Status               | Description            | Next Action          |
| -------------------- | ---------------------- | -------------------- |
| **Draft**            | Initial plan creation  | AI validation        |
| **Ready for Review** | AI validation complete | Request human review |
| **In Review**        | Human reviewing        | Await feedback       |
| **Approved**         | Human approved ✅       | Ready to implement   |
| **Complete**         | Implementation done    | -                    |

### Implementation Gate
⚠️ **IMPORTANT**: Implementation can only begin after human approval.
- Status must be "Approved"
- All review feedback addressed
- Final confirmation received