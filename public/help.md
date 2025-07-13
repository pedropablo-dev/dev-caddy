# ⚡️ Guía de Uso para broWorks Dev-Caddy

¡Bienvenido a tu arsenal de desarrollo! Esta guía te ayudará a dominar todas las funcionalidades de Dev-Caddy.

---

### Navegación y Conceptos Básicos

-   **Panel de Categorías (Izquierda):** Navega entre tus categorías personalizadas. La primera, **⭐ Favoritos**, es especial: contiene todos los items que marques con una estrella para un acceso prioritario.
-   **Búsqueda Principal (`Ctrl+K`):** Usa la barra de búsqueda superior para filtrar los items de la categoría seleccionada por nombre o contenido. Es la forma más rápida de encontrar lo que necesitas.
-   **Colapsar Panel:** Usa el botón en la parte inferior izquierda para minimizar el panel de categorías y maximizar tu espacio de trabajo. El estado se guardará para tu próxima visita.

---

### #️⃣ Tipos de Items y Cómo Usarlos

Dev-Caddy soporta diferentes tipos de contenido para cada necesidad.

#### ▶️ Comando Simple
El más básico. Un comando o texto que no cambia.
-   **Uso:** Simplemente haz clic en el botón **`Copy`**. El contenido se copiará a tu portapapeles.

#### 🚀 Workflow (Secuencia de Pasos)
Perfecto para procesos que requieren múltiples comandos en un orden específico (ej: un despliegue).
-   **Uso:** El botón **`Copy Step & Next`** es la clave. Al pulsarlo, copia el comando del paso actual y avanza automáticamente al siguiente, mostrándote en qué parte del proceso te encuentras.

#### 📝 Comando con Variables
Son plantillas de comandos con "huecos" que puedes rellenar.
-   **Uso:** Rellena los campos de texto que aparecen debajo del comando. Una vez rellenados, pulsa el botón **`Copy`** para generar el comando final con tus datos ya integrados.

#### ✨ Prompt de IA
Diseñado para guardar, gestionar y reutilizar prompts complejos para modelos de lenguaje.
-   **Uso:** Puedes ver el prompt completo en un área de texto. Usa el botón **`Copy Prompt`** para copiarlo. Para editarlo o usar sus funciones avanzadas, debes ir al Panel de Administración.

---

### ⚙️ Panel de Administración (`/admin`)

El centro de control total de tu Dev-Caddy. Aquí puedes añadir, editar, reordenar y eliminar todo el contenido.

#### Gestionar Categorías (Columna Izquierda)
-   **Añadir:** Crea nuevas categorías con nombre e icono.
-   **Reordenar:** Usa las flechas (⬆️⬇️) al lado de cada categoría para cambiar su posición en la lista.
-   **Editar y Duplicar:** Al pasar el ratón sobre una categoría, aparecen los iconos de **lápiz (editar)** y **copia (duplicar)**. Duplicar una categoría también duplica todos los items que contiene.
-   **Eliminar:** Selecciona una categoría y pulsa el botón de eliminar. **¡Cuidado!** Esto borrará la categoría y todos sus items permanentemente.

#### Gestionar Items (Columna Derecha)
-   **Añadir Item:** Usa los botones superiores para añadir un nuevo item (Simple, Workflow o Prompt) a la categoría que tengas seleccionada.
-   **Reordenar:** Al igual que con las categorías, usa las flechas (⬆️⬇️) para cambiar el orden de los items.
-   **Editar y Duplicar:** Los iconos de lápiz y copia aparecen al pasar el ratón sobre un item, permitiéndote gestionarlo individualmente.

---

### 🚀 El Editor de Prompts Avanzado

Al crear o editar un "Prompt de IA", accederás a un editor especializado con herramientas potentes:

-   **Barra de Herramientas Markdown:** Justo encima del área de texto, tienes botones para aplicar formato rápidamente (negrita, cursiva, títulos, listas, bloques de código, etc.).
-   **Panel Derecho (Variables y Buscador):**
    -   **Buscador:** Te permite encontrar texto dentro de tu prompt. Usa `Enter` para buscar y las flechas para navegar entre coincidencias.
    -   **Variables Dinámicas:** Define variables (ej: `{nombre_componente}`) y añádelas a una lista. Luego, con un solo clic, podrás insertarlas en el punto del cursor dentro de tu prompt, agilizando la creación de plantillas.
-   **Contadores y Límite:** En la parte inferior, puedes ver el número de palabras y caracteres. También puedes establecer un límite de caracteres opcional, muy útil para prompts que deben ajustarse a un tamaño máximo.
-   **Modo Zen:** El botón de `Maximizar` activa un modo de escritura sin distracciones, ocultando todo excepto el editor de texto. Pulsa `Esc` para salir.