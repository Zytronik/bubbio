import { AnimationConfig } from '../_interface/animationConfig';

export class AnimationSequence {
    private animations: AnimationConfig[];
    private isAborted: boolean;

    constructor(animations: AnimationConfig[]) {
        this.animations = animations;
        this.isAborted = false;
    }

    play() {
        let currentDelay = 0;

        this.animations.forEach((animation, index) => {
            setTimeout(async () => {
                if (this.isAborted) return;

                // Wait for the element if it's not immediately available
                const element = await this.waitForElement(animation.selector);

                if (element) {
                    // Call onStart if provided
                    animation.onStart?.();

                    // Handle adding or removing a CSS property instantly
                    if (
                        animation.addProperty &&
                        animation.propertyName &&
                        animation.value
                    ) {
                        const cssPropertyName = animation.propertyName.replace(
                            /[A-Z]/g,
                            match => `-${match.toLowerCase()}`,
                        );

                        element.style.setProperty(
                            cssPropertyName,
                            animation.value,
                        );

                        // Store the property for potential removal on abort
                        animation._appliedProperty = cssPropertyName;

                        animation.onEnd?.();
                    } else if (
                        animation.removeProperty &&
                        animation.propertyName
                    ) {
                        const cssPropertyName = animation.propertyName.replace(
                            /[A-Z]/g,
                            match => `-${match.toLowerCase()}`,
                        );

                        element.style.removeProperty(cssPropertyName);
                        animation.onEnd?.();
                    }

                    // Handle class-based animations with duration
                    if (animation.className && animation.duration) {
                        element.classList.add(animation.className);

                        setTimeout(() => {
                            if (!this.isAborted && animation.className) {
                                element.classList.remove(animation.className);
                                animation.onEnd?.();
                            } else {
                                this.removeAllAnimationClasses();
                                this.removeAllProperties();
                            }
                        }, animation.duration);
                    }
                }
            }, currentDelay);

            currentDelay += (animation.duration || 0) + (animation.delay || 0);
        });
    }

    abort() {
        this.isAborted = true;
        this.removeAllAnimationClasses();
        this.removeAllProperties();
    }

    private removeAllAnimationClasses() {
        this.animations.forEach(animation => {
            const element = document.querySelector(
                animation.selector,
            ) as HTMLElement;
            if (element && animation.className) {
                element.classList.remove(animation.className);
            }
        });
    }

    private removeAllProperties() {
        this.animations.forEach(animation => {
            const element = document.querySelector(
                animation.selector,
            ) as HTMLElement;
            if (element && animation._appliedProperty) {
                element.style.removeProperty(animation._appliedProperty);
            }
        });
    }

    private waitForElement(
        selector: string,
        timeout = 5000,
    ): Promise<HTMLElement | null> {
        return new Promise(resolve => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else {
                    elapsedTime += intervalTime;
                    if (elapsedTime >= timeout) {
                        clearInterval(interval);
                        resolve(null);
                    }
                }
            }, intervalTime);
        });
    }
}
