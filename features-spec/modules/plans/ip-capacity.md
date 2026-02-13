To implement the `IP_Capacity` entity, I will create a new module `IpCapacitiesModule` that mirrors existing modules like `CompaniesModule`. This involves creating a self-contained structure in `src/ip-capacities` with `domain`, `dto`, and `infrastructure` layers. As per the user's request, I will focus solely on the Relational persistence implementation using TypeORM. I will define the `CwrCapacity` enum in the domain layer and ensure the `code` field enforces uniqueness in the database. I will also include standard pagination in the `findAll` operation.

Plan:
1.  **Create Directory Structure**: Initialize the `src/ip-capacities` directory and its subdirectories: `domain`, `dto`, `infrastructure/persistence/relational`.
2.  **Define Domain Elements**:
    *   Create `src/ip-capacities/domain/ip-capacity.ts` to define the `IpCapacity` class with fields `id`, `name`, `code`, and `cwrCapacity`.
    *   Create `src/ip-capacities/domain/cwr-capacity.enum.ts` with values `Acquier`, `Adaptor`, `Administrator`.
3.  **Create DTOs**:
    *   `src/ip-capacities/dto/create-ip-capacity.dto.ts` (Validation for name, code, cwrCapacity).
    *   `src/ip-capacities/dto/update-ip-capacity.dto.ts` (PartialType).
    *   `src/ip-capacities/dto/find-all-ip-capacities.dto.ts` (Pagination).
4.  **Define Repository Interface**: Create `src/ip-capacities/infrastructure/persistence/ip-capacity.repository.ts` as an abstract class.
5.  **Implement Relational Persistence**:
    *   Entity: `src/ip-capacities/infrastructure/persistence/relational/entities/ip-capacity.entity.ts` (TypeORM, `unique: true` for code) make sure the table name is plural.
    *   Mapper: `src/ip-capacities/infrastructure/persistence/relational/mappers/ip-capacity.mapper.ts`.
    *   Repository: `src/ip-capacities/infrastructure/persistence/relational/repositories/ip-capacity.repository.ts`.
    *   Module: `src/ip-capacities/infrastructure/persistence/relational/relational-persistence.module.ts`.
6.  **Create Service**: Implement `src/ip-capacities/ip-capacities.service.ts` using the repository interface.
7.  **Create Controller**: Implement `src/ip-capacities/ip-capacities.controller.ts` with REST endpoints (`POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id`).
8.  **Create Module**: Implement `src/ip-capacities/ip-capacities.module.ts` which imports `RelationalIpCapacityPersistenceModule`.
9.  **Register Module**: Add `IpCapacitiesModule` to the `imports` array in `src/app.module.ts`.
10. **Present Plan**: Present this plan for user approval.