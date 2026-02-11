# 🚀 react-view-import

**React View Import** is a lightweight utility for **lazy-importing entire modules** with flexible loading strategies — ideal for performance-critical apps and static Next.js (`output: 'export'`) sites.

By default, it **loads modules immediately when components are in the viewport** (often on mount), but also supports delayed loading on custom conditions.

It helps you:

- ⚡ **Lazy import modules by default** when components enter the viewport (loads immediately if already visible on mount)
- 🎯 **Force load on mount** for critical components that need immediate availability regardless of visibility
- 🎛️ **Load on condition** using boolean flags for custom loading logic (click, hover, sequential loading, etc.)
- 🧱 Keep your bundle lean by deferring heavy component code
- 🚀 Improve first load performance and bandwidth usage
- 🧭 Avoid unnecessary `useEffect` overhead
- 🪄 Work seamlessly with static exports and SSR-disabled pages

---

## ✨ Features

- ✅ **Lazy module imports** - Import entire modules only when components enter the viewport
- ✅ **Flexible loading strategies** - Load on viewport visibility, mount, or custom boolean conditions
- ✅ **Advanced loading patterns** - Sequential loading, dependency-based loading, interaction-based loading
- ✅ **Performance optimization** - Configurable thresholds, root margins, and loading strategies
- ✅ **Error handling** - Graceful failure handling and custom loading states
- ✅ **Framework integration** - Works seamlessly with Next.js, Vite, CRA, and more
- ✅ **Bundle size optimization** - Reduce initial bundle size by deferring heavy component code
- ✅ Works with both **Next.js** and **CRA/Vite**
- ✅ Minimal runtime (~1 KB gzipped)
- ✅ No dependency on `useEffect` or delayed hydration
- ✅ Compatible with `output: 'export'` builds

---

## 📦 Installation

```bash
npm install react-view-import
# or
yarn add react-view-import
# or
pnpm add react-view-import
```

## 🚀 Usage

### Basic Example

```tsx
import { UILazyInView } from "react-view-import";

// For default exports: exportName="default"
const HeavyComponent = () => <div>This component loads only when visible!</div>;
export default HeavyComponent;

export default function App() {
  return (
    <UILazyInView
      importer={() => import("./HeavyComponent")}
      exportName="default" // Use "default" for default exports
      componentProps={{}}
    />
  );
}
```

### With Named Export

```tsx
import { UILazyInView } from "react-view-import";

// For named exports: exportName matches the export name
export const MyComponent = ({ title }: { title: string }) => <div>{title}</div>;

export default function App() {
  return (
    <UILazyInView
      importer={() => import("./components/MyComponent")}
      exportName="MyComponent" // Use the exact export name
      componentProps={{ title: "Hello" }}
    />
  );
}
```

### With Custom Placeholder and Options

```tsx
import { UILazyInView } from "react-view-import";

export default function App() {
  return (
    <UILazyInView
      importer={() => import("./HeavyChart")}
      exportName="HeavyChart"
      componentProps={{ data: chartData }}
      placeholder={<div>Loading chart...</div>}
      threshold={0.1}
      rootMargin="50px"
      onInView={() => console.log("Component is now visible")}
    />
  );
}
```

### Load on Mount (Forced)

Load the component immediately when the parent component mounts, regardless of viewport visibility:

```tsx
import { UILazyInView } from "react-view-import";

export default function App() {
  return (
    <UILazyInView
      importer={() => import("./CriticalComponent")}
      exportName="CriticalComponent"
      componentProps={{}}
      loadOnMount={true}
    />
  );
}
```

### Load on Custom Condition

Load the component based on a custom boolean condition instead of viewport visibility:

```tsx
import { UILazyInView } from "react-view-import";

export default function App() {
  const [shouldLoad, setShouldLoad] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldLoad(true)}>Load Component</button>
      <UILazyInView
        importer={() => import("./ConditionalComponent")}
        exportName="ConditionalComponent"
        componentProps={{}}
        loadOnCondition={shouldLoad}
      />
    </div>
  );
}
```

### Advanced: Sequential Loading on Scroll

Load components one after another as you scroll, or based on user interactions like hover/click:

```tsx
import { useState, useCallback } from "react";
import { UILazyInView } from "react-view-import";

interface SectionData {
  title: string;
  index: number;
  importer: () => Promise<{ default: React.ComponentType<any> }>;
}

export const SequentialLoader = ({ sections }: { sections: SectionData[] }) => {
  const [loadedIndexes, setLoadedIndexes] = useState<number[]>([]);

  const handleInView = useCallback((index: number) => {
    // Mark section as visible when it enters viewport
    setLoadedIndexes((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    );
  }, []);

  return (
    <div>
      {sections.map(({ title, index, importer }) => (
        <UILazyInView
          key={index}
          importer={importer}
          exportName="default"
          componentProps={{ title }}
          loadOnCondition={loadedIndexes.includes(index)}
          onInView={() => handleInView(index)}
          placeholder={<div>Loading {title}...</div>}
        />
      ))}
    </div>
  );
};
```

This enables patterns like:

- **Sequential loading**: Load components one by one as user scrolls
- **Dependency-based loading**: Load component only after previous components are loaded
- **Interaction-based loading**: Load on click, hover, or other user interactions
- **Progressive enhancement**: Load additional content based on user engagement

## 🔧 Advanced Usage

### Performance Optimization

#### Root Margin Tuning

Control when loading triggers with `rootMargin`:

```tsx
// Load 2 seconds before entering viewport (good for slow networks)
<UILazyInView
  importer={() => import("./HeavyComponent")}
  exportName="default"
  componentProps={{}}
  rootMargin="2000px 0px"  // 2 seconds at 60fps scroll
/>

// Load only when component is fully visible
<UILazyInView
  importer={() => import("./Component")}
  exportName="default"
  componentProps={{}}
  threshold={1.0}  // 100% visible
/>
```

#### Bundle Splitting Strategy

Optimize bundle splitting by component size:

```tsx
// Large components - preload earlier
<UILazyInView
  importer={() => import("./DataVisualization")}
  exportName="Chart"
  componentProps={{}}
  rootMargin="1000px 0px"
/>

// Small components - load when visible
<UILazyInView
  importer={() => import("./SmallWidget")}
  exportName="default"
  componentProps={{}}
  rootMargin="100px 0px"
/>
```

### Error Handling

Handle import failures gracefully:

```tsx
import { useState } from "react";
import { UILazyInView } from "react-view-import";

const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return fallback;

  return <div onError={() => setHasError(true)}>{children}</div>;
};

export default function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load component</div>}>
      <UILazyInView
        importer={() => import("./UnstableComponent")}
        exportName="default"
        componentProps={{}}
        placeholder={<div>Loading...</div>}
      />
    </ErrorBoundary>
  );
}
```

### Loading States Management

Create custom loading states:

```tsx
import { useState } from "react";
import { UILazyInView } from "react-view-import";

const LoadingStates = {
  IDLE: "idle",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error",
};

export const SmartLoader = ({ importer, exportName, componentProps }) => {
  const [loadState, setLoadState] = useState(LoadingStates.IDLE);

  const handleLoadStart = () => setLoadState(LoadingStates.LOADING);
  const handleLoadComplete = () => setLoadState(LoadingStates.LOADED);
  const handleLoadError = () => setLoadState(LoadingStates.ERROR);

  return (
    <UILazyInView
      importer={async () => {
        handleLoadStart();
        try {
          const module = await importer();
          handleLoadComplete();
          return module;
        } catch (error) {
          handleLoadError();
          throw error;
        }
      }}
      exportName={exportName}
      componentProps={componentProps}
      placeholder={
        loadState === LoadingStates.LOADING ? (
          <div>🚀 Loading...</div>
        ) : (
          <div>⏳ Preparing...</div>
        )
      }
    />
  );
};
```

### Framework Integration

#### Next.js App Router

```tsx
// app/components/LazySection.tsx
"use client";

import { UILazyInView } from "react-view-import";

// Dynamic imports work with both default and named exports
export const LazySection = ({ sectionId }) => (
  <UILazyInView
    importer={() => import(`../sections/${sectionId}`)}
    exportName="default" // Use "default" for default exports
    componentProps={{}}
    rootMargin="500px 0px"
  />
);
```

#### Export Name Matching

**Important**: The `exportName` must exactly match how the component is exported:

```tsx
// ✅ Correct usage:

// For default exports:
export default MyComponent;
// Use: exportName="default"

// For named exports:
export const MyComponent = () => <div />;
// Use: exportName="MyComponent"

export const ChartComponent = () => <div />;
// Use: exportName="ChartComponent"
```

#### Vite with Dynamic Imports

```tsx
// Optimize chunk naming
const loadChart = () =>
  import(/* webpackChunkName: "charts" */ "./ChartComponent");

<UILazyInView importer={loadChart} exportName="default" componentProps={{}} />;
```

#### With React Suspense

```tsx
import { Suspense } from "react";
import { UILazyInView } from "react-view-import";

const LoadingFallback = () => <div>🌟 Loading amazing content...</div>;

export const App = () => (
  <Suspense fallback={<LoadingFallback />}>
    <UILazyInView
      importer={() => import("./AmazingComponent")}
      exportName="default"
      componentProps={{}}
    />
  </Suspense>
);
```

### Debugging & Troubleshooting

#### Common Issues

**Component not loading:**

```tsx
// Check if component is within viewport
<UILazyInView
  importer={() => import("./Component")}
  exportName="default"
  componentProps={{}}
  onInView={() => console.log("Component is visible!")}
  rootMargin="0px" // Test with no margin
/>
```

**Wrong export name:**

```tsx
// ❌ Wrong - component exported as named export
export const MyChart = () => <div />;
<UILazyInView
  importer={() => import("./MyChart")}
  exportName="default"  // Should be "MyChart"
/>

// ✅ Correct
<UILazyInView
  importer={() => import("./MyChart")}
  exportName="MyChart"  // Matches the export name
/>
```

**Bundle size not reduced:**

```tsx
// Ensure dynamic imports are not tree-shaken
// ❌ Wrong - webpack might bundle this
import Component from "./HeavyComponent";

// ✅ Correct - dynamic import
const importer = () => import("./HeavyComponent");
```

**Performance issues:**

```tsx
// Profile with React DevTools
<UILazyInView
  importer={() => {
    console.time("import");
    return import("./Component").finally(() => console.timeEnd("import"));
  }}
  exportName="default"
  componentProps={{}}
/>
```

## 📚 API Reference

### UILazyInView Props

| Prop              | Type                                                       | Default                 | Description                                                                                                                    |
| ----------------- | ---------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `importer`        | `() => Promise<{ [key: string]: React.ComponentType<T> }>` | -                       | Function that returns a dynamic import promise                                                                                 |
| `exportName`      | `string`                                                   | -                       | Name of the exported component from the module (use "default" for default exports, or the exact export name for named exports) |
| `componentProps`  | `T`                                                        | -                       | Props to pass to the lazy-loaded component                                                                                     |
| `threshold`       | `number`                                                   | `0.5`                   | IntersectionObserver threshold (0-1)                                                                                           |
| `placeholder`     | `React.ReactNode`                                          | `null`                  | Component to show while loading                                                                                                |
| `loadOnMount`     | `boolean`                                                  | `false`                 | Force load immediately on mount, regardless of viewport visibility                                                             |
| `loadOnCondition` | `boolean`                                                  | `false`                 | Load when this boolean becomes true (enables sequential loading, click/hover triggers, dependency-based loading)               |
| `forwardRef`      | `React.Ref<HTMLDivElement>`                                | -                       | Ref to forward to the wrapper div                                                                                              |
| `onInView`        | `() => void`                                               | -                       | Callback when component enters viewport                                                                                        |
| `rootMargin`      | `string`                                                   | `'1000px 0px'`          | IntersectionObserver root margin                                                                                               |
| `loadState`       | `LazyLoadState`                                            | `LazyLoadState.DEFAULT` | Loading strategy (used internally with loadOnMount/loadOnCondition)                                                            |

### Loading Behavior

The component uses a priority system for determining when to load:

1. **`loadOnMount={true}`**: Forces loading immediately when the component mounts (highest priority, ignores viewport)
2. **`loadOnCondition={true}`**: Loads when the condition becomes true (medium priority)
3. **Default (viewport-based)**: Loads immediately if component is visible on mount, otherwise loads when it enters viewport

### LazyLoadState

The `loadState` prop controls the loading strategy and is automatically set based on the boolean flags:

- `DEFAULT`: Load immediately if visible on mount, otherwise when component enters viewport
- `LOADED_ON_MOUNT`: Force load immediately on mount (when `loadOnMount={true}`)
- `LAZY_ON_CONDITION`: Load based on custom condition (when `loadOnCondition={true}`)

## 🔧 Peer Dependencies

This package requires the following peer dependencies:

- `react` >= 17.0.0
- `react-dom` >= 17.0.0
- `react-intersection-observer` >= 9.13.0

## 📄 License

MIT
