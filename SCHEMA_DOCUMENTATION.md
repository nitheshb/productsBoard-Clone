# 📊 Complete Application Schema Documentation

## 🗄️ Database Schema

### Core Tables

#### 1. **products** Table
```sql
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT,
    progress INTEGER DEFAULT 0,
    team TEXT,
    days INTEGER,
    startDate DATE,
    targetDate DATE,
    completedOn DATE,
    remarks TEXT,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `name` - Product name (required)
- `status` - Product status (optional)
- `progress` - Progress percentage (0-100)
- `team` - Assigned team (optional)
- `days` - Estimated days (optional)
- `startDate` - Start date (optional)
- `targetDate` - Target completion date (optional)
- `completedOn` - Actual completion date (optional)
- `remarks` - Additional notes (optional)
- `description` - Product description (optional)
- `version` - Version identifier (default: '1.0.0')
- `owner_initials` - Owner initials (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### 2. **components** Table
```sql
CREATE TABLE components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT,
    progress INTEGER DEFAULT 0,
    team TEXT,
    days INTEGER,
    startDate DATE,
    targetDate DATE,
    completedOn DATE,
    remarks TEXT,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `product_id` - Foreign key to products table
- `name` - Component name (required)
- `status` - Component status (optional)
- `progress` - Progress percentage (0-100)
- `team` - Assigned team (optional)
- `days` - Estimated days (optional)
- `startDate` - Start date (optional)
- `targetDate` - Target completion date (optional)
- `completedOn` - Actual completion date (optional)
- `remarks` - Additional notes (optional)
- `description` - Component description (optional)
- `version` - Version identifier (default: '1.0.0')
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### 3. **features** Table
```sql
CREATE TABLE features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES components(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Todo',
    progress INTEGER DEFAULT 0,
    team TEXT,
    days INTEGER,
    startDate DATE,
    targetDate DATE,
    completedOn DATE,
    remarks TEXT,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0.0',
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `component_id` - Foreign key to components table
- `name` - Feature name (required)
- `status` - Feature status (default: 'Todo')
- `progress` - Progress percentage (0-100)
- `team` - Assigned team (optional)
- `days` - Estimated days (optional)
- `startDate` - Start date (optional)
- `targetDate` - Target completion date (optional)
- `completedOn` - Actual completion date (optional)
- `remarks` - Additional notes (optional)
- `description` - Feature description (optional)
- `version` - Version identifier (default: '1.0.0')
- `color` - UI color identifier (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### 4. **versions** Table
```sql
CREATE TABLE versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `version` - Version string (unique, required)
- `description` - Version description (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_products_version ON products(version);
CREATE INDEX idx_components_version ON components(version);
CREATE INDEX idx_features_version ON features(version);
CREATE INDEX idx_components_product_id ON components(product_id);
CREATE INDEX idx_features_component_id ON features(component_id);
```

### Database Views
```sql
-- Version-based progress view
CREATE VIEW version_progress AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.version as product_version,
    p.progress as product_progress,
    c.id as component_id,
    c.name as component_name,
    c.version as component_version,
    c.progress as component_progress,
    f.id as feature_id,
    f.name as feature_name,
    f.version as feature_version,
    f.progress as feature_progress,
    f.status as feature_status,
    f.team as feature_team
FROM products p
LEFT JOIN components c ON p.id = c.product_id AND p.version = c.version
LEFT JOIN features f ON c.id = f.component_id AND c.version = f.version
WHERE p.version IS NOT NULL;
```

---

## 🔧 TypeScript Interfaces

### Core Interfaces (`src/app/types/index.ts`)

#### Product Interface
```typescript
export interface Product {
  id: string;
  name: string;
  status?: string;
  progress?: number;
  team?: string;
  days?: number;
  startDate?: string;
  targetDate?: string;
  completedOn?: string;
  remarks?: string;
  description?: string;
  version?: string;
  created_at: string;
  components?: Component[];
}
```

#### Component Interface
```typescript
export interface Component {
  id: string;
  product_id: string;
  name: string;
  status?: string;
  progress?: number;
  team?: string;
  days?: number;
  startDate?: string;
  targetDate?: string;
  completedOn?: string;
  remarks?: string;
  description?: string;
  version?: string;
  created_at: string;
  features?: Feature[];
}
```

#### Feature Interface
```typescript
export interface Feature {
  id: string;
  component_id: string;
  name: string;
  status?: string;
  progress?: number;
  team?: string;
  days?: number;
  startDate?: string;
  targetDate?: string;
  completedOn?: string;
  remarks?: string;
  description?: string;
  version?: string;
  color?: 'yellow' | 'teal' | 'blue' | string;
  created_at: string;
}
```

#### Version Interface
```typescript
export interface Version {
  id: string;
  version: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
```

#### TableItem Interface (for UI)
```typescript
export interface TableItem {
  type: 'product' | 'component' | 'feature';
  id: string;
  name: string;
  level: number;
  data: Product | Component | Feature;
  children?: TableItem[];
}
```

---

## 🌐 API Routes Structure

### Product API Routes

#### `GET /api/product` - Get All Products
- **Query Parameters:**
  - `search` - Search products by name
  - `version` - Filter by version
  - `team` - Filter by team
  - `status` - Filter by status
- **Response:** Array of products with nested components and features

#### `POST /api/product` - Create Product
- **Body:**
  ```typescript
  {
    name: string;           // Required
    status?: string;
    progress?: number;
    team?: string;
    days?: number;
    startDate?: string;
    targetDate?: string;
    completedOn?: string;
    remarks?: string;
    version?: string;       // Default: '1.0.0'
  }
  ```

#### `GET /api/product/[id]` - Get Single Product
- **Response:** Product with nested components and features

#### `PUT /api/product/[id]` - Update Product
- **Body:** Same as POST but all fields optional except `id`

#### `DELETE /api/product/[id]` - Delete Product
- **Cascade:** Deletes all related components and features

### Component API Routes

#### `GET /api/component` - Get All Components
- **Query Parameters:**
  - `product_id` - Filter by product
  - `version` - Filter by version
- **Response:** Array of components

#### `POST /api/component` - Create Component
- **Body:**
  ```typescript
  {
    name: string;           // Required
    product_id: string;     // Required
    status?: string;
    progress?: number;
    team?: string;
    days?: number;
    startDate?: string;
    targetDate?: string;
    completedOn?: string;
    remarks?: string;
    version?: string;       // Default: '1.0.0'
  }
  ```

#### `GET /api/component/[id]` - Get Single Component
- **Response:** Component with nested features

#### `PUT /api/component/[id]` - Update Component
- **Body:** Same as POST but all fields optional except `id`

#### `DELETE /api/component/[id]` - Delete Component
- **Cascade:** Deletes all related features

### Feature API Routes

#### `GET /api/features` - Get All Features
- **Query Parameters:**
  - `component_id` - Filter by component
  - `version` - Filter by version
  - `team` - Filter by team
  - `status` - Filter by status
- **Response:** Array of features

#### `POST /api/features` - Create Feature
- **Body:**
  ```typescript
  {
    name: string;           // Required
    component_id: string;   // Required
    status?: string;        // Default: 'Todo'
    progress?: number;      // Auto-calculated from status if not provided
    team?: string;
    days?: number;
    startDate?: string;
    targetDate?: string;
    completedOn?: string;
    remarks?: string;
    version?: string;       // Default: '1.0.0'
    updateComponentProgress?: boolean; // Default: true
  }
  ```

#### `GET /api/features/[id]` - Get Single Feature
- **Response:** Feature object

#### `PUT /api/features/[id]` - Update Feature
- **Body:** Same as POST but all fields optional except `id`

#### `DELETE /api/features/[id]` - Delete Feature

### Version API Routes

#### `GET /api/versions` - Get All Versions
- **Response:** Array of available versions

#### `POST /api/versions` - Create Version
- **Body:**
  ```typescript
  {
    version: string;        // Required, must be unique
    description?: string;
  }
  ```

---

## 🔄 Data Relationships

### Hierarchical Structure
```
Product (1) ──→ Components (N)
Component (1) ──→ Features (N)
```

### Version Relationships
- Products, Components, and Features can have different versions
- Version filtering allows viewing data for specific versions
- Progress calculations can be version-specific

### Progress Calculation Flow
```
Feature Progress → Component Progress → Product Progress
```

**Progress Calculation Rules:**
1. **Feature Progress:** Manual input or calculated from status
   - Todo: 0%
   - In Progress: 50%
   - Completed: 100%

2. **Component Progress:** Average of all feature progress values

3. **Product Progress:** Average of all component progress values

---

## 🎯 Filtering and Querying

### Available Filters
1. **Version Filter** - Filter by specific version
2. **Team Filter** - Filter by assigned team
3. **Status Filter** - Filter by status (Todo, In Progress, Completed)
4. **Date Range Filter** - Filter by start/target dates
5. **Search Filter** - Text search across names

### Filter Combinations
- Multiple filters can be applied simultaneously
- Filters work across all entity types (products, components, features)
- Version filtering affects progress calculations

---

## 📊 UI Components Schema

### Form Components
- **CreateModal** - Product creation form
- **CreateComponentModal** - Component creation form
- **CreateFeatureModal** - Feature creation form
- **ProductDetails** - Product edit form
- **ComponentDetails** - Component edit form
- **FeatureDetails** - Feature edit form

### Filter Components
- **VersionFilter** - Version dropdown filter
- **TeamFilter** - Team dropdown filter
- **StatusFilter** - Status dropdown filter
- **DateFilter** - Date range filter
- **FilterContainer** - Container for all filters

### Table Components
- **ProductTable** - Main data table with hierarchical display
- **TableItem** - Individual table row component

---

## 🔐 Security and Permissions

### Supabase RLS (Row Level Security)
- All tables have RLS enabled
- Users can only access their own data
- Proper authentication required for all operations

### API Security
- All API routes validate input data
- Proper error handling and logging
- Rate limiting considerations

---

## 📈 Performance Considerations

### Database Optimization
- Indexes on frequently queried columns
- Efficient joins for hierarchical data
- Pagination for large datasets

### Caching Strategy
- Client-side caching for frequently accessed data
- Optimistic updates for better UX
- Background progress calculations

---

## 🚀 Deployment Schema

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Migration
- Run `database_schema_updates.sql` for version support
- Ensure all indexes are created
- Verify foreign key constraints

---

## 📝 Notes

1. **Version Defaults:** All new items default to version '1.0.0'
2. **Progress Auto-calculation:** Feature progress auto-calculates from status
3. **Cascade Deletes:** Deleting a product/component cascades to children
4. **Timestamps:** All tables have created_at and updated_at fields
5. **UUID Primary Keys:** All tables use UUID for primary keys
6. **Optional Fields:** Most fields are optional except name and foreign keys

This schema provides a complete foundation for the product board application with version support, hierarchical data management, and comprehensive filtering capabilities. 