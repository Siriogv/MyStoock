export class TextDatabase {
  async saveSettings(settings: any): Promise<void> {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to local storage:", error);
      throw new Error("Failed to save settings.");
    }
  }

  async loadSettings(): Promise<any | null> {
    try {
      const settings = localStorage.getItem("settings");
      return settings ? JSON.parse(settings) : null;
    } catch (error: any) {
      console.error("Failed to load settings from local storage:", error);
      return null;
    }
  }
}
