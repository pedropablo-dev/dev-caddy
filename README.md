# 🧰 Dev-Caddy: Tu Arsenal de Comandos Personal

**Dev-Caddy** es una paleta de comandos personal, ultrarrápida y centralizada. Ha sido diseñada para eliminar la fricción de buscar y recordar comandos de terminal, rutas, URLs y prompts complejos de uso frecuente. Organiza todo tu conocimiento de desarrollo en un arsenal lógico y accesible al instante.

_¿Cansado de buscar en tu historial, notas o wikis internas el mismo comando una y otra vez? Dev-Caddy es la solución._

---

## ✨ Características Principales

* **Organización Intuitiva:** Agrupa tus comandos en **categorías** personalizables con iconos para una fácil identificación visual.
* **Búsqueda Instantánea:** Un potente cuadro de búsqueda (`Ctrl+K`) te permite filtrar categorías y encontrar cualquier item por su nombre o contenido en milisegundos.
* **⭐ Sistema de Favoritos:** Marca cualquier item con una estrella para anclarlo a la sección de "Favoritos" y tener un acceso aún más rápido.
* **Panel de Administración Integrado:** Una interfaz de administrador (`/admin`) te permite realizar operaciones CRUD, **duplicar** y **reordenar** tanto categorías como items mediante una sencilla interfaz de arrastrar y soltar (drag-and-drop).
* **Interfaz Eficiente y Persistente:** El estado de la UI, como la categoría seleccionada o si la barra lateral está colapsada, se guarda en el `localStorage` para que tu espacio de trabajo se mantenga entre sesiones.

###  versatile Item Types

Dev-Caddy soporta múltiples tipos de "items" para adaptarse a cualquier necesidad:

| Tipo | Icono | Descripción |
| :--- | :---: | :--- |
| **Comando Simple** | `▶️` | Un comando directo listo para copiar y pegar. |
| **Workflow** | `🚀` | Una secuencia de comandos guiada. Copia un paso y avanza al siguiente con un solo clic, ideal para procesos complejos. |
| **Con Variables** | `📝` | Plantillas de comandos con "huecos" que puedes rellenar dinámicamente antes de copiar el resultado final. |
| **Prompt de IA** | `✨` | Almacena, visualiza y gestiona prompts multilínea complejos para reutilizarlos fácilmente con modelos de lenguaje. Incluye un editor avanzado con formato Markdown y gestión de variables. |

---

## 🛠️ Stack Tecnológico

* **Framework:** [Next.js](https://nextjs.org/) (con App Router)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI:** [Shadcn UI](https://ui.shadcn.com/)
* **Gestión de Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
* **Renderizado de Markdown:** `react-markdown`

---

## 🏗️ Arquitectura

1.  **Fuente de Datos (`app/data/commands.json`):** El proyecto funciona sin una base de datos tradicional. `commands.json` es la fuente única y absoluta de verdad para todas las categorías e items.
2.  **API Local (`app/api/commands/route.ts`):** Un endpoint de Next.js se encarga de leer y escribir en el archivo `commands.json` de forma desacoplada, permitiendo que el frontend y el panel de administración interactúen con los datos.
3.  **Gestión de Estado (`store/*.ts`):** Zustand maneja estados globales que persisten en `localStorage`, como la categoría seleccionada por el usuario (`appStore.ts`) y el estado de la barra lateral (`uiStore.ts`).

---

## 🚀 Cómo Empezar

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/pedropablo-dev/dev-caddy.git](https://github.com/pedropablo-dev/dev-caddy.git)
    cd dev-caddy
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abre [http://localhost:3002](http://localhost:3002) en tu navegador para ver la aplicación.
    * El panel de administración está disponible en [http://localhost:3002/admin](http://localhost:3002/admin).
