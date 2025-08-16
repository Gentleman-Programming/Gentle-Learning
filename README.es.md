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

- **🔬 Repetición Espaciada SM-2**: Programación automática de revisiones con **15% más retención** que el estudio tradicional
- **⏰ Ritmos Ultradianos**: Ciclos de 90-120 minutos con ratio óptimo de trabajo-descanso 52/17
- **🎯 Ratio DeskTime 52/17**: Timing basado en evidencia de **los mejores performers**
- **🧠 Teoría de Carga Cognitiva**: Sesiones limitadas a 4±1 conceptos para procesamiento óptimo de memoria
- **🌅 Optimización de Cronotipos**: Hasta **25% mejor rendimiento** con sincronización circadiana
- **📲 Framework JITAI**: Notificaciones inteligentes en horarios de máximo engagement (6-8am, 10pm-medianoche)
- **🌿 Descansos Basados en Evidencia**: Escenas de naturaleza de 40 segundos para **23% mejora de atención**
- **🎯 Evaluación SART**: Medición de atención sostenida para sesiones personalizadas
- **🔄 Detección Adaptiva de Fatiga**: Optimización en tiempo real basada en retroalimentación

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

### 📐 Implementación del Ratio DeskTime 52/17
```typescript
function calculateOptimalSession(userProfile: UserProfile) {
  // Aplicar ratio 52/17 basado en evidencia para adultos
  if (userProfile.age >= 18 && userProfile.age <= 60) {
    return {
      sessionLength: 52, // minutos - mejores performers de DeskTime
      breakDuration: 17, // minutos - ratio óptimo 3:1
      maxConcepts: 4     // límite de Teoría de Carga Cognitiva
    };
  }
  
  // Ajustado por edad para estudiantes más jóvenes/mayores
  const attentionSpan = userProfile.age < 18 
    ? Math.min(userProfile.age * 3, 45) 
    : Math.min(50, ULTRADIAN_CYCLE * 0.8);
    
  return {
    sessionLength: attentionSpan,
    breakDuration: attentionSpan * 0.22,
    maxConcepts: userProfile.age < 18 ? 3 : 4
  };
}
```

### 🔄 SM-2 Avanzado con Evaluación de Calidad
```typescript
function calculateSessionQuality(session: StudySession, completionRate: number): number {
  let quality = 3; // Comenzar neutral
  
  // Factor 1: Tasa de completitud
  if (completionRate >= 90) quality += 1;
  else if (completionRate < 50) quality -= 1;
  
  // Factor 2: Impacto de fatiga (inverso)
  quality += (10 - session.performance.selfReportedFatigue) / 10;
  
  // Factor 3: Puntuación de enfoque
  if (session.performance.focusScore >= 80) quality += 0.5;
  
  return Math.max(0, Math.min(5, quality));
}

function scheduleNextReview(quality: number, interval: number, easeFactor: number) {
  const nextInterval = calculateNextInterval(interval, easeFactor, quality);
  const newEaseFactor = updateEaseFactor(easeFactor, quality);
  
  return {
    nextReview: getOptimalReviewTime(new Date(), nextInterval),
    interval: nextInterval,
    easeFactor: newEaseFactor
  };
}
```

### 🌿 Actividades de Descanso Basadas en Evidencia
```typescript
function getOptimalBreakActivities(duration: number) {
  if (duration <= 2) {
    // Microdescansos: escenas de naturaleza 40 seg = 23% mejora de atención
    return [
      { activity: 'Ver escenas de naturaleza', duration: 40, benefit: '23% mejora de atención' },
      { activity: 'Respiración profunda (4-7-8)', duration: 60, benefit: 'Reduce carga cognitiva' }
    ];
  }
  
  // Descansos largos: movimiento = 15% mejora musculoesquelética
  return [
    { activity: 'Movimiento físico ligero', benefit: '15% mejora musculoesquelética' },
    { activity: 'Caminata en naturaleza', benefit: '20% aumento memoria de trabajo' }
  ];
}
```

---

## 🌟 Roadmap

### 🎯 Fase Actual (v1.0) - ✅ COMPLETADO
- [x] **Assessment científico SART** con evaluación de cronotipos
- [x] **Repetición espaciada SM-2** con programación automática de revisiones
- [x] **Ratio DeskTime 52/17** optimizado para estudiantes adultos
- [x] **Teoría de carga cognitiva** implementada (límite de 4±1 conceptos)
- [x] **Framework JITAI** para timing óptimo de notificaciones
- [x] **Microdescansos basados en evidencia** con recomendaciones de naturaleza
- [x] **Detección adaptiva de fatiga** con optimización en tiempo real
- [x] **Integración de ritmos ultradianos** para programación de sesiones
- [x] **Tema dark elegante** con conformidad WCAG 2.1 AA
- [x] **Deploy en GitHub Pages** con pipeline CI/CD

### 🚀 Próximas Características (v2.0)
- [ ] **Algoritmo LECTOR** - Repetición Orientada a Conceptos Mejorada con LLM (90.2% de éxito)
- [ ] **Práctica Intercalada** - Implementación de práctica mixta vs bloqueada (Cohen's d = 0.83)
- [ ] **Actividades de Descanso Avanzadas** - Experiencias VR de naturaleza y movimiento guiado
- [ ] **Integración Biométrica** - Variabilidad de ritmo cardíaco para detección de fatiga en tiempo real
- [ ] **Interferencia Semántica** - Ajustes de espaciado conscientes del contenido
- [ ] **Gamificación Progresiva** - Sistema de logros basado en neurociencia

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
- 🔗 **Todos mis links**: [doras.to/gentleman-programming](https://doras.to/gentleman-programming)

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