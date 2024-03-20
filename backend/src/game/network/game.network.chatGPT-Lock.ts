export class chatGPTLock {
  private isLocked: boolean = false;

  async acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.isLocked) {
        this.isLocked = true;
        resolve();
      } 
    });
  }

  release(): void {
    this.isLocked = false;
  }
}