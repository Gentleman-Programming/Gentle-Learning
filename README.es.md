# 🧠 Gentle Learning

**Aprendizaje científico, personalizado y sin estrés**

> Una aplicación web revolucionaria que transforma la forma en que estudias, utilizando algoritmos científicos para maximizar tu retención y minimizar la fatiga cognitiva.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Gentle--Learning-E343B9?style=for-the-badge)](https://gentleman-programming.github.io/Gentle-Learning/)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)

[![English](https://img.shields.io/badge/🇺🇸_English-README-blue?style=flat-square)](./README.md)

---

## 🎯 La Idea

Como **Alan "The Gentleman"** del canal de YouTube [Gentleman Programming](https://youtube.com/@gentlemanprogramming), siempre he creído que la tecnología debe servir para mejorar nuestra vida, no complicarla. **Gentle Learning** nace de una frustración personal: ¿por qué seguimos estudiando de la misma manera que hace 100 años cuando la neurociencia nos ha dado herramientas mucho mejores?

### 🚀 Mi Visión

**Democratizar el aprendizaje científico.** Quiero que cualquier persona, desde un estudiante de secundaria hasta un profesional aprendiendo nuevas tecnologías, tenga acceso a las mismas técnicas de estudio que usan los mejores investigadores del mundo.

### 💡 El Problema que Resolvemos

- **📚 Estudias por horas pero olvidas todo en días**
- **😵 Te sientes abrumado y no sabes cuándo descansar** 
- **⏰ No tienes idea de cuál es tu momento óptimo para aprender**
- **🔄 Repites información sin estrategia**
- **📱 Las apps existentes son genéricas y no se adaptan a ti**

---

## 🧬 La Ciencia Detrás de Gentle Learning

Esta aplicación está basada en **investigación científica real**, no en modas o opiniones. Cada algoritmo implementado tiene respaldo empírico:

### 📊 Fundamentos Científicos

- **🔬 Spaced Repetition**: Basado en el algoritmo SM-2 de SuperMemo, con **15% más retención** que el estudio tradicional
- **⏰ Ritmos Ultradianos**: Ciclos de 90-120 minutos descobridos por Nathaniel Kleitman para optimizar concentración
- **🎯 Ratio 52/17**: Análisis de DeskTime de los mejores performers - **52 minutos de trabajo, 17 de descanso**
- **🧠 Teoría de Carga Cognitiva**: Límite de 4±1 elementos en memoria de trabajo (John Sweller)
- **🌅 Cronotipos**: Hasta **25% mejor rendimiento** cuando sincronizas con tu ritmo circadiano
- **📲 JITAI Framework**: Just-in-Time Adaptive Interventions para notificaciones inteligentes

### 📈 Resultados Comprobados

- **Arizona State University**: **18% aumento** en tasas de aprobación
- **University of Mississippi**: Reducción de **31% a 14.5%** en tasas de abandono
- **LECTOR Algorithm**: **90.2% de efectividad** en retención

---

## ✨ Características Principales

### 🎯 Assessment Científico Personalizado
- **SART** (Sustained Attention to Response Task) para medir tu capacidad de concentración real
- **Evaluación de Cronotipos** para encontrar tu momento óptimo del día
- **Análisis de Patrones** de respuesta y tiempo de reacción

### 🧠 Algoritmos Inteligentes
- **SM-2 Modificado** para repetición espaciada personalizada
- **Optimización Ultradian** que respeta tus ciclos naturales de 90 minutos
- **Ajuste Dinámico** basado en tu rendimiento en tiempo real

### 📱 Experiencia de Usuario
- **Tema Dark Accesible** - WCAG 2.1 AA compliant
- **Notificaciones Inteligentes** que no te molestan
- **Progreso Visual** con métricas científicas
- **Adaptable** a cualquier dispositivo

### 🎨 Tecnología Moderna
- **Angular 20** con Zoneless Change Detection
- **Server-Side Rendering** para SEO óptimo
- **CSS Variables** para temas personalizables
- **Local Storage** para privacidad total

---

## 🛠️ Tecnologías Utilizadas

```typescript
{
  "frontend": "Angular 20 + TypeScript",
  "runtime": "Bun (más rápido que Node.js)",
  "styling": "SCSS + CSS Variables",
  "architecture": "Zoneless + SSR + Standalone Components",
  "deployment": "GitHub Pages",
  "algorithms": "SM-2, SART, JITAI, Ultradian Cycles",
  "accessibility": "WCAG 2.1 AA",
  "data": "Local Storage (sin tracking)"
}
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
```bash
# Instalar Bun (más rápido que npm/yarn)
curl -fsSL https://bun.sh/install | bash
```

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Gentleman-Programming/Gentle-Learning.git
cd Gentle-Learning

# Instalar dependencias
bun install

# Iniciar el servidor de desarrollo
bun start
```

### Scripts Disponibles
```bash
bun start                    # Servidor de desarrollo
bun run build               # Build de producción con SSR
bun run build:github-pages  # Build estático para GitHub Pages
bun run lint                # ESLint + Prettier
bun run test                # Tests unitarios
```

---

## 🧮 Los Algoritmos en Acción

### 📐 Cálculo de Sesión Óptima
```typescript
function calculateOptimalSession(userProfile: UserProfile) {
  const baseAttentionSpan = userProfile.age < 18 
    ? Math.min(userProfile.age * 3, 45) 
    : 50;
    
  const sessionLength = Math.min(
    baseAttentionSpan, 
    ULTRADIAN_CYCLE * 0.8 // 90 min * 0.8 = 72 min máx
  );
  
  const breakDuration = sessionLength * 0.22; // Ratio científico
  
  return { sessionLength, breakDuration };
}
```

### 🔄 Repetición Espaciada SM-2
```typescript
function calculateNextInterval(interval: number, easeFactor: number, quality: number) {
  if (quality >= 3) { // Respuesta correcta
    return interval === 0 ? 1 : 
           interval === 1 ? 6 : 
           Math.round(interval * easeFactor);
  }
  return 1; // Reiniciar si es incorrecta
}
```

---

## 🌟 Roadmap

### 🎯 Fase Actual (v1.0)
- [x] Assessment científico completo
- [x] Algoritmos de repetición espaciada
- [x] Optimización de sesiones
- [x] Tema dark accesible
- [x] Deploy en GitHub Pages

### 🚀 Próximas Características (v2.0)
- [ ] **Gamificación Científica** - Sistema de logros basado en neurociencia
- [ ] **Análisis de Progreso** - Gráficos de curva de olvido personalizada
- [ ] **Modo Colaborativo** - Sesiones de estudio grupales optimizadas
- [ ] **IA Adaptativa** - Machine learning para predicción de rendimiento
- [ ] **Integración con Calendarios** - Scheduling automático

### 🌍 Visión a Largo Plazo (v3.0)
- [ ] **VR/AR Support** - Entornos de estudio inmersivos
- [ ] **Biometric Integration** - Heart rate variability para detectar fatiga
- [ ] **Multi-idioma** - Adaptación cultural de algoritmos
- [ ] **Modo Offline** - PWA con sincronización

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Como desarrollador educativo, creo firmemente en el **open source** y el **aprendizaje colaborativo**.

### 🎯 Cómo Contribuir
1. **Fork** el repositorio
2. Crea una **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'feat: add amazing feature'`)
4. **Push** a la branch (`git push origin feature/amazing-feature`)
5. Abre un **Pull Request**

### 📋 Áreas que Necesitan Ayuda
- **🧪 Más algoritmos científicos** (FSRS, LECTOR, etc.)
- **🎨 Mejoras de UX/UI**
- **♿ Accesibilidad** y internacionalización
- **📱 Progressive Web App** features
- **🧪 Tests** unitarios y de integración

---

## 📞 Contacto

**Alan "The Gentleman" Buscaglia**
- 🎥 **YouTube**: [@GentlemanProgramming](https://youtube.com/@gentlemanprogramming)
- 🐦 **Twitter**: [@AlanBuscaglia](https://twitter.com/alanbuscaglia)
- 💼 **LinkedIn**: [Alan Buscaglia](https://linkedin.com/in/alanbuscaglia)
- 📧 **Email**: alan@gentlemanprogramming.com

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT** - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **🔬 Neuroscience Research Community** por años de investigación en aprendizaje
- **🅰️ Angular Team** por una framework increíble
- **🍞 Bun Team** por revolucionar el JavaScript runtime
- **👥 Gentleman Programming Community** por el feedback constante

---

<div align="center">

### 🌟 Si te gusta el proyecto, ¡dale una estrella! ⭐

**Hecho con ❤️ por [Alan "The Gentleman"](https://youtube.com/@gentlemanprogramming)**

*"El mejor código es el que ayuda a las personas a aprender mejor"*

</div>