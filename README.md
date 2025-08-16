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

- **🔬 Spaced Repetition**: Based on SuperMemo's SM-2 algorithm, with **15% more retention** than traditional studying
- **⏰ Ultradian Rhythms**: 90-120 minute cycles discovered by Nathaniel Kleitman to optimize concentration
- **🎯 52/17 Ratio**: DeskTime analysis of top performers - **52 minutes work, 17 minutes rest**
- **🧠 Cognitive Load Theory**: Limit of 4±1 elements in working memory (John Sweller)
- **🌅 Chronotypes**: Up to **25% better performance** when you sync with your circadian rhythm
- **📲 JITAI Framework**: Just-in-Time Adaptive Interventions for smart notifications

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

### 📐 Optimal Session Calculation
```typescript
function calculateOptimalSession(userProfile: UserProfile) {
  const baseAttentionSpan = userProfile.age < 18 
    ? Math.min(userProfile.age * 3, 45) 
    : 50;
    
  const sessionLength = Math.min(
    baseAttentionSpan, 
    ULTRADIAN_CYCLE * 0.8 // 90 min * 0.8 = 72 min max
  );
  
  const breakDuration = sessionLength * 0.22; // Scientific ratio
  
  return { sessionLength, breakDuration };
}
```

### 🔄 SM-2 Spaced Repetition
```typescript
function calculateNextInterval(interval: number, easeFactor: number, quality: number) {
  if (quality >= 3) { // Correct response
    return interval === 0 ? 1 : 
           interval === 1 ? 6 : 
           Math.round(interval * easeFactor);
  }
  return 1; // Reset if incorrect
}
```

---

## 🌟 Roadmap

### 🎯 Current Phase (v1.0)
- [x] Complete scientific assessment
- [x] Spaced repetition algorithms
- [x] Session optimization
- [x] Accessible dark theme
- [x] GitHub Pages deployment

### 🚀 Next Features (v2.0)
- [ ] **Scientific Gamification** - Achievement system based on neuroscience
- [ ] **Progress Analysis** - Personalized forgetting curve charts
- [ ] **Collaborative Mode** - Optimized group study sessions
- [ ] **Adaptive AI** - Machine learning for performance prediction
- [ ] **Calendar Integration** - Automatic scheduling

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
- 🎥 **YouTube**: [@GentlemanProgramming](https://youtube.com/@gentlemanprogramming)
- 🐦 **Twitter**: [@AlanBuscaglia](https://twitter.com/alanbuscaglia)
- 💼 **LinkedIn**: [Alan Buscaglia](https://linkedin.com/in/alanbuscaglia)
- 📧 **Email**: alan@gentlemanprogramming.com

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