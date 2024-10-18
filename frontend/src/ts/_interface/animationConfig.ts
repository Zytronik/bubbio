export interface AnimationConfig {
  selector: string;
  className?: string;
  duration?: number;
  delay?: number;
  addProperty?: boolean;
  removeProperty?: boolean;
  propertyName?: string;
  value?: string;
  onStart?: () => void;
  onEnd?: () => void;
  _appliedProperty?: string;
}
