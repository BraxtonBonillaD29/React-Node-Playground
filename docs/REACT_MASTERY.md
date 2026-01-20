# ⚛️ React Mastery Cheat Sheet
*Guía rápida para Entrevistas Frontend & System Design*

## 1. Gestión de Estado (State Management)

| Hook | ¿Cuándo usarlo? | Símil |
| :--- | :--- | :--- |
| **`useState`** | Valores simples (números, strings, booleanos). | **"Memoria a corto plazo"** |
| **`useReducer`** | Estados complejos, múltiples sub-valores, o cuando el siguiente estado depende de lógica difícil. | **"Semáforo / Policía"** |
| **`useContext`** | Datos globales (Usuario, Tema, Idioma) para evitar Prop Drilling. | **"Telepatía / Nube"** |
| **`useRef`** | Guardar valores que **NO** deben provocar re-renders (DOM, Timers, variables mutables). | **"Caja Fuerte invisible"** |

---

## 2. Ciclo de Vida & Efectos (`useEffect`)

**Sintaxis:** `useEffect(Efecto, [Dependencias])`

*   **`[]` (Vacío):** Solo al montar (ej: Fetch API inicial).
*   **`[prop, state]`:** Al montar y cada vez que cambien esas variables.
*   **Sin array:** En CADA render (Peligroso ☠️).

**⚠️ Regla de Oro (Limpieza):**
Siempre retorna una función de limpieza si creas listeners, intervalos o suscripciones.
```javascript
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // <--- OBLIGATORIO
}, []);
```

---

## 3. Performance & Optimizaciones

| Herramienta | Objetivo | ¿Qué devuelve? |
| :--- | :--- | :--- |
| **`React.memo`** | Evita que un componente hijo se renderice si sus props no cambian. | Un componente memoizado. |
| **`useMemo`** | Evita recalcular valores pesados (filtros, sorts). | El **RESULTADO** (valor). |
| **`useCallback`**| Evita recsear funciones en cada render (para no romper `React.memo`). | La **FUNCIÓN** misma. |

**🚀 Virtualización (Listas Infinitas):**
*   **Problema:** Renderizar 100,000 items bloquea el navegador.
*   **Solución:** Pintar solo los visibles (ej: 20) + usar `padding` vacío para simular altura.
*   **Matemática:** `startIndex = Math.floor(scrollTop / itemHeight)`.

---

## 4. Control de Eventos de Alta Frecuencia

**El Problema:** Eventos como `scroll`, `resize` o `keypress` ocurren cientos de veces por segundo.

### 🐢 **Debounce** (El Paciente)
*   **Lógica:** "Espera a que el usuario deje de actuar por X tiempo".
*   **Uso:** Buscadores (Search Bar), Auto-Guardado (Auto-Save).
*   **Código clave:** `clearTimeout(timer)` cada vez que llega un evento nuevo.

### 🏎️ **Throttle** (El Constante)
*   **Lógica:** "Ejecuta máximo una vez cada X tiempo, pase lo que pase".
*   **Uso:** Scroll Infinito, Redimensionar Ventana (Resize), botón "Comprar" (anti-spam).
*   **Código clave:** `if (now - lastTime >= limit) ejecutar()`.

---

## 5. Preguntas Trampa de Entrevista

**Q: ¿Por qué mi componente hijo se renderiza aunque use `React.memo`?**
A: Porque probablemente le estás pasando una función (`onClick`) o un objeto (`style`) que se recrea en cada render del padre. **Solución:** Usa `useCallback` o `useMemo` en el padre.

**Q: ¿Cuál es la diferencia entre `useMemo` y `useCallback`?**
A: `useMemo` guarda el valor retornado por una función. `useCallback` guarda la función en sí misma.

**Q: ¿Cómo evito que mi página colapse con 1M de datos?**
A: Virtualización (Windowing) y Paginación en Backend.
