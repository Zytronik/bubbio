import { AnimationConfig } from '../_interface/animationConfig';

export class AnimationSequence {
  private animations: AnimationConfig[];
  private isAborted: boolean;

  constructor(animations: AnimationConfig[]) {
    this.animations = animations;
    this.isAborted = false;
  }

  async play() {
    for (const animation of this.animations) {
      if (this.isAborted) break;
      await this.runAnimation(animation);
    }
  }

  private runAnimation(animation: AnimationConfig): Promise<void> {
    return new Promise(resolve => {
      // Call onStart if provided
      animation.onStart?.();

      const element = document.querySelector(animation.selector) as HTMLElement;

      if (element) {
        // Handle adding or removing a CSS property instantly
        if (
          animation.addProperty &&
          animation.propertyName &&
          animation.value
        ) {
          const cssPropertyName = this.toKebabCase(animation.propertyName);

          element.style.setProperty(cssPropertyName, animation.value);

          animation._appliedProperty = cssPropertyName;

          // Await onEnd if provided and then resolve
          if (animation.onEnd) {
            Promise.resolve(animation.onEnd()).then(resolve);
          } else {
            resolve();
          }
        } else if (animation.removeProperty && animation.propertyName) {
          const cssPropertyName = this.toKebabCase(animation.propertyName);

          element.style.removeProperty(cssPropertyName);

          // Await onEnd if provided and then resolve
          if (animation.onEnd) {
            Promise.resolve(animation.onEnd()).then(resolve);
          } else {
            resolve();
          }
        }

        // Handle class-based animations with duration
        if (animation.className && animation.duration) {
          element.classList.add(animation.className);

          setTimeout(() => {
            if (!this.isAborted && animation.className) {
              element.classList.remove(animation.className);

              // Await onEnd if provided and then resolve
              if (animation.onEnd) {
                Promise.resolve(animation.onEnd()).then(resolve);
              } else {
                resolve();
              }
            } else {
              this.removeAnimationClass(animation);
              resolve();
            }
          }, animation.duration);
        } else {
          resolve();
        }
      } else {
        resolve(); // If element not found, resolve immediately
      }
    });
  }

  abort() {
    this.isAborted = true;
    this.removeAllAnimationClasses();
  }

  private removeAllAnimationClasses() {
    this.animations.forEach(animation => {
      this.removeAnimationClass(animation);
    });
  }

  private removeAnimationClass(animation: AnimationConfig) {
    const element = document.querySelector(animation.selector) as HTMLElement;
    if (element && animation.className) {
      element.classList.remove(animation.className);
    }
  }

  private toKebabCase(propertyName: string): string {
    return propertyName.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  }
}
