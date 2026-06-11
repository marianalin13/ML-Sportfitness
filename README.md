# ML Sportfitness 🏃‍♀️💪

Prescripción inteligente de ejercicio y nutrición, fundamentada en evidencia científica. Creada por una fisioterapeuta colombiana.

## Cómo publicarla GRATIS en internet con GitHub Pages

No necesitas instalar nada en tu computador. GitHub construye y publica la app por ti.

### Paso 1 — Crear el repositorio
1. Entra a [github.com](https://github.com) con tu cuenta.
2. Clic en el botón verde **"New"** (o el "+" arriba a la derecha → "New repository").
3. Nombre del repositorio: `ml-sportfitness` (en minúsculas, sin espacios).
4. Déjalo en **Public** y clic en **"Create repository"**.

### Paso 2 — Subir los archivos
1. En la página del repositorio nuevo, clic en **"uploading an existing file"**.
2. Abre en tu computador la carpeta `ml-sportfitness` que descargaste y descomprimiste.
3. Arrastra TODO el contenido de la carpeta (incluyendo las carpetas `src` y `.github`) a la ventana de GitHub.
   - ⚠️ Importante: arrastra el **contenido** de la carpeta, no la carpeta misma.
   - ⚠️ Si la carpeta `.github` no se sube arrastrando, créala manualmente: en GitHub clic en
     "Add file" → "Create new file", escribe como nombre `.github/workflows/deploy.yml`
     y pega adentro el contenido del archivo `deploy.yml` de tu computador.
4. Abajo, clic en **"Commit changes"**.

### Paso 3 — Activar GitHub Pages
1. En tu repositorio, ve a **Settings** (⚙️) → en el menú izquierdo, **Pages**.
2. En "Build and deployment" → **Source**, selecciona **"GitHub Actions"**.
3. Ve a la pestaña **Actions** del repositorio: verás el flujo "Publicar en GitHub Pages"
   ejecutándose (círculo amarillo). Espera 1-2 minutos hasta que quede en verde ✅.

### Paso 4 — ¡Listo! Comparte tu app
Tu app quedará publicada en:

```
https://TU-USUARIO.github.io/ml-sportfitness/
```

(Reemplaza TU-USUARIO por tu nombre de usuario de GitHub. El enlace exacto también
aparece en Settings → Pages.)

Comparte ese enlace por WhatsApp con tu equipo. Desde el celular, ábrelo en el
navegador y usa **"Añadir a pantalla de inicio"** para que quede como una app con ícono.

### Para actualizar la app después
Cada vez que reemplaces un archivo en GitHub (por ejemplo `src/App.jsx`) y hagas
"Commit changes", la app se reconstruye y publica sola en 1-2 minutos.

---

## Para desarrolladores (opcional)

```bash
npm install
npm run dev      # ver en local: http://localhost:5173
npm run build    # generar versión de producción en /dist
```

## Nota importante
ML Sportfitness es una herramienta de orientación y acompañamiento.
No reemplaza la consulta médica, nutricional, fisioterapéutica ni deportiva profesional.
