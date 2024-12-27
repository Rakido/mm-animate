declare global {
  interface Window {
    moonMoonText: any;
    gsap: any;
    ScrollTrigger: any;
    CustomEase: any;
    SplitType: any;
  }
}

export class MoonMoonText {
  private splitInstances: Map<HTMLElement, any> = new Map();
  private animations: Map<HTMLElement, any> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    if (typeof window !== 'undefined') {
      this.initTextAnimation();
    }
  }

  cleanup(element?: HTMLElement) {
    if (element) {
      // Cleanup specific element
      const animation = this.animations.get(element);
      if (animation?.kill) {
        animation.kill();
      }
      this.animations.delete(element);

      const splitInstance = this.splitInstances.get(element);
      if (splitInstance?.revert) {
        splitInstance.revert();
      }
      this.splitInstances.delete(element);
    } else {
      // Cleanup all
      this.animations.forEach(animation => {
        if (animation?.kill) {
          animation.kill();
        }
      });
      this.animations.clear();

      this.splitInstances.forEach(instance => {
        if (instance?.revert) {
          instance.revert();
        }
      });
      this.splitInstances.clear();
    }
  }

  initTextAnimation(targetElement?: HTMLElement) {
    if (typeof window === 'undefined') return;

    try {
      window.gsap.registerPlugin(window.ScrollTrigger, window.CustomEase);

      const elements = targetElement 
        ? [targetElement]
        : Array.from(document.querySelectorAll("[data-scroll-text-reveal]"));

      elements.forEach((element) => {
        if (!element || !element.isConnected) return;

        // Cleanup previous animation for this element
        this.cleanup(element);

        try {
          const staggerValue = parseFloat(element.getAttribute('data-stagger') || '0.1');
          const delayValue = parseFloat(element.getAttribute('data-delay') || '0');
          const durationValue = parseFloat(element.getAttribute('data-duration') || '1');
          const animationTypes = element.getAttribute('data-animate')?.split(' ') || [];
          const axis = element.getAttribute('data-axis');
          const axisValue = element.getAttribute('data-axis-value') || (axis?.startsWith('-') ? '-100%' : '100%');

          let textContent;
          const splitType = element.getAttribute('data-splitting');
          
          if (splitType && window.SplitType) {
            const splitInstance = new window.SplitType(element, {
              types: splitType === 'chars' ? 'chars' : 
                    splitType === 'words' ? 'words' : 'lines'
            });
            this.splitInstances.set(element, splitInstance);
            textContent = splitType === 'chars' ? splitInstance.chars :
                         splitType === 'words' ? splitInstance.words :
                         splitInstance.lines;
          } else {
            textContent = [element];
          }

          if (!textContent?.length) return;

          const animation = window.gsap.from(textContent, {
            opacity: 0,
            y: axis === 'x' ? 0 : '100%',
            x: axis === 'x' ? '100%' : 0,
            duration: durationValue,
            stagger: staggerValue,
            delay: delayValue,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top bottom-=10%",
              end: "bottom top+=10%",
              toggleActions: "play none none reverse"
            }
          });

          this.animations.set(element, animation);
          if (splitInstance) {
            this.splitInstances.set(element, splitInstance);
          }

        } catch (error) {
          console.error('Error processing element:', error);
        }
      });
    } catch (error) {
      console.error('Error in initTextAnimation:', error);
    }
  }
} 