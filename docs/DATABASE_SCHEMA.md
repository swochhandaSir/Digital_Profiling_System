# Database schema

## User

Stores name, unique email, bcrypt password hash, role (`ADMIN`, `MAYOR`, `WARD_CHAIRPERSON`), optional ward number, active flag, and timestamps. The ward number is constrained to 1–12; authorization relies on the persisted user account.

## Household

Stores a ward scoped household code, residential area, family member count, optional household head, creator, and timestamps. `(householdCode, wardNumber)` is unique. Citizens reference a household, so household counts use unique household records, not citizen counts.

## Citizen

Stores name, optional phone, ward, household reference, residential area, economic category and its source/assessment details, submitter, workflow status, decision actor/time, notes, and timestamps. A sparse unique index on `(wardNumber, phoneNumber)` helps detect duplicates without merging records.

## AuditLog

Stores actor, action, entity type and ID, bounded action detail, IP address, and timestamps. Application endpoints only append events; no audit update/delete endpoint is exposed.
