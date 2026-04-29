# app-structure Specification

## Purpose
TBD - created by archiving change configure-execution-environment. Update Purpose after archive.
## Requirements
### Requirement: Package.json scripts
The system SHALL have updated package.json scripts using Vite commands instead of vue-cli-service.

#### Scenario: Dev script
- **WHEN** package.json is checked
- **THEN** the scripts SHALL include `"dev": "vite"` for development server

#### Scenario: Build script
- **WHEN** package.json is checked
- **THEN** the scripts SHALL include `"build": "vite build"` for production build

#### Scenario: Preview script
- **WHEN** package.json is checked
- **THEN** the scripts SHALL include `"preview": "vite preview"` for previewing production build

#### Scenario: Capacitor scripts preserved
- **WHEN** package.json is checked
- **THEN** the scripts SHALL preserve existing Capacitor scripts (cap:sync, cap:add:android, cap:add:ios)

