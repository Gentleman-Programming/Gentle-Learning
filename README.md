# 🧠 Gentle Learning

**Scientific, personalized, and stress-free learning**

> A revolutionary web application that transforms how you study, using scientific algorithms to maximize retention and minimize cognitive fatigue.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Gentle--Learning-E343B9?style=for-the-badge)](https://gentleman-programming.github.io/Gentle-Learning/)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)

[![Español](https://img.shields.io/badge/🇪🇸_Español-README-blue?style=flat-square)](./README.es.md)

---

## 🎯 The Idea

As **Alan "The Gentleman"** from the YouTube channel [Gentleman Programming](https://youtube.com/@gentlemanprogramming), I've always believed that technology should serve to improve our lives, not complicate them. **Gentle Learning** was born from a personal frustration: why do we continue studying the same way we did 100 years ago when neuroscience has given us much better tools?

### 🚀 My Vision

**Democratize scientific learning.** I want anyone, from a high school student to a professional learning new technologies, to have access to the same study techniques used by the world's best researchers.

### 💡 The Problem We Solve

- **📚 You study for hours but forget everything in days**
- **😵 You feel overwhelmed and don't know when to rest** 
- **⏰ You have no idea what your optimal learning time is**
- **🔄 You repeat information without strategy**
- **📱 Existing apps are generic and don't adapt to you**

---

## 🧬 The Science Behind Gentle Learning

This application is based on **real scientific research**, not trends or opinions. Every implemented algorithm has empirical backing:

### 📊 Scientific Foundations

- **🔬 SM-2 Spaced Repetition**: Automatic review scheduling with **15% more retention** than traditional studying
- **⏰ Ultradian Rhythms**: 90-120 minute cycles with optimal 52/17 work-break ratio
- **🎯 DeskTime 52/17 Ratio**: Evidence-based timing for **top performer productivity**
- **🧠 Cognitive Load Theory**: Sessions limited to 4±1 concepts for optimal memory processing
- **🌅 Chronotype Optimization**: Up to **25% better performance** with circadian rhythm sync
- **📲 JITAI Framework**: Smart notifications timed for peak engagement (6-8am, 10pm-midnight)
- **🌿 Evidence-Based Breaks**: 40-second nature scenes for **23% attention improvement**
- **🎯 SART Assessment**: Sustained attention measurement for personalized session lengths
- **🔄 Adaptive Fatigue Detection**: Real-time optimization based on performance feedback

### 📈 Proven Results

- **Arizona State University**: **18% increase** in pass rates
- **University of Mississippi**: Reduction from **31% to 14.5%** in dropout rates
- **LECTOR Algorithm**: **90.2% effectiveness** in retention

---

## ✨ Key Features

### 🎯 Personalized Scientific Assessment
- **SART** (Sustained Attention to Response Task) to measure your real concentration capacity
- **Chronotype Evaluation** to find your optimal time of day
- **Pattern Analysis** of response and reaction times

### 🧠 Intelligent Algorithms
- **Modified SM-2** for personalized spaced repetition
- **Ultradian Optimization** that respects your natural 90-minute cycles
- **Dynamic Adjustment** based on your real-time performance

### 📱 User Experience
- **Accessible Dark Theme** - WCAG 2.1 AA compliant
- **Smart Notifications** that don't bother you
- **Visual Progress** with scientific metrics
- **Responsive** to any device

### 🎨 Modern Technology
- **Angular 20** with Zoneless Change Detection
- **Server-Side Rendering** for optimal SEO
- **CSS Variables** for customizable themes
- **Local Storage** for total privacy

---

## 🛠️ Technologies Used

```typescript
{
  "frontend": "Angular 20 + TypeScript",
  "runtime": "Bun (faster than Node.js)",
  "styling": "SCSS + CSS Variables",
  "architecture": "Zoneless + SSR + Standalone Components",
  "deployment": "GitHub Pages",
  "algorithms": "SM-2, SART, JITAI, Ultradian Cycles",
  "accessibility": "WCAG 2.1 AA",
  "data": "Local Storage (no tracking)"
}
```

---

## 🚀 Quick Start

### Prerequisites
```bash
# Install Bun (faster than npm/yarn)
curl -fsSL https://bun.sh/install | bash
```

### Installation
```bash
# Clone the repository
git clone https://github.com/Gentleman-Programming/Gentle-Learning.git
cd Gentle-Learning

# Install dependencies
bun install

# Start development server
bun start
```

### Available Scripts
```bash
bun start                    # Development server
bun run build               # Production build with SSR
bun run build:github-pages  # Static build for GitHub Pages
bun run lint                # ESLint + Prettier
bun run test                # Unit tests
```

---

## 🧮 The Algorithms in Action

### 📐 DeskTime 52/17 Ratio Implementation
```typescript
function calculateOptimalSession(userProfile: UserProfile) {
  // Apply evidence-based 52/17 ratio for adults
  if (userProfile.age >= 18 && userProfile.age <= 60) {
    return {
      sessionLength: 52, // minutes - DeskTime top performers
      breakDuration: 17, // minutes - optimal 3:1 ratio
      maxConcepts: 4     // Cognitive Load Theory limit
    };
  }
  
  // Age-adjusted for younger/older learners
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

### 🔄 Advanced SM-2 with Quality Assessment
```typescript
function calculateSessionQuality(session: StudySession, completionRate: number): number {
  let quality = 3; // Start neutral
  
  // Factor 1: Completion rate
  if (completionRate >= 90) quality += 1;
  else if (completionRate < 50) quality -= 1;
  
  // Factor 2: Fatigue impact (inverse)
  quality += (10 - session.performance.selfReportedFatigue) / 10;
  
  // Factor 3: Focus score
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

### 🌿 Evidence-Based Break Activities
```typescript
function getOptimalBreakActivities(duration: number) {
  if (duration <= 2) {
    // Microbreaks: 40-second nature scenes = 23% attention boost
    return [
      { activity: 'View nature scenes', duration: 40, benefit: '23% attention improvement' },
      { activity: 'Deep breathing (4-7-8)', duration: 60, benefit: 'Reduces cognitive load' }
    ];
  }
  
  // Longer breaks: movement = 15% musculoskeletal improvement
  return [
    { activity: 'Light physical movement', benefit: '15% musculoskeletal improvement' },
    { activity: 'Nature walk', benefit: '20% working memory boost' }
  ];
}
```

---

## 🌟 Roadmap

### 🎯 Current Phase (v1.0) - ✅ COMPLETED
- [x] **SART-based scientific assessment** with chronotype evaluation
- [x] **SM-2 spaced repetition** with automatic review scheduling
- [x] **DeskTime 52/17 ratio** optimization for adult learners
- [x] **Cognitive load theory** implementation (4±1 concepts limit)
- [x] **JITAI framework** for optimal notification timing
- [x] **Evidence-based microbreaks** with nature scene recommendations
- [x] **Adaptive fatigue detection** with real-time optimization
- [x] **Ultradian rhythm** integration for session scheduling
- [x] **Elegant dark theme** with WCAG 2.1 AA compliance
- [x] **GitHub Pages deployment** with CI/CD pipeline

### 🚀 Next Features (v2.0)
- [ ] **LECTOR Algorithm** - LLM-Enhanced Concept-based Test-Oriented Repetition (90.2% success rate)
- [ ] **Interleaved Practice** - Mixed vs blocked practice implementation (Cohen's d = 0.83)
- [ ] **Advanced Break Activities** - VR nature experiences and guided movement
- [ ] **Biometric Integration** - Heart rate variability for real-time fatigue detection
- [ ] **Semantic Interference** - Content-aware spacing adjustments
- [ ] **Progressive Gamification** - Neuroscience-based achievement system

### 🌍 Long-term Vision (v3.0)
- [ ] **VR/AR Support** - Immersive study environments
- [ ] **Biometric Integration** - Heart rate variability for fatigue detection
- [ ] **Multi-language** - Cultural adaptation of algorithms
- [ ] **Offline Mode** - PWA with synchronization

---

## 🤝 Contributing

Contributions are welcome! As an educational developer, I firmly believe in **open source** and **collaborative learning**.

### 🎯 How to Contribute
1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

### 📋 Areas That Need Help
- **🧪 More scientific algorithms** (FSRS, LECTOR, etc.)
- **🎨 UX/UI improvements**
- **♿ Accessibility** and internationalization
- **📱 Progressive Web App** features
- **🧪 Unit and integration tests**

---

## 📞 Contact

**Alan "The Gentleman" Buscaglia**
- 🔗 **All Links**: [doras.to/gentleman-programming](https://doras.to/gentleman-programming)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **🔬 Neuroscience Research Community** for years of learning research
- **🅰️ Angular Team** for an incredible framework
- **🍞 Bun Team** for revolutionizing the JavaScript runtime
- **👥 Gentleman Programming Community** for constant feedback

---

<div align="center">

### 🌟 If you like the project, give it a star! ⭐

**Made with ❤️ by [Alan "The Gentleman"](https://youtube.com/@gentlemanprogramming)**

*"The best code is the one that helps people learn better"*

</div>