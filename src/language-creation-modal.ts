import { App, Modal, Notice, Setting } from 'obsidian';

export class CreateLanguageModal extends Modal {
  private languageName = '';

  constructor(
    app: App,
    private readonly onCreate: (name: string) => Promise<void>
  ) {
    super(app);
  }

  onOpen(): void {
    this.contentEl.empty();
    this.setTitle('Create a language');

    new Setting(this.contentEl)
      .setName('Language name')
      .setDesc('Enter the language name as you want it to appear in your vault.')
      .addText((text) => {
        text
          .setPlaceholder('e.g. Vareli')
          .onChange((value) => {
            this.languageName = value;
          });

        text.inputEl.focus();
        text.inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            void this.submit();
          }
        });
      });

    new Setting(this.contentEl).addButton((button) => {
      button
        .setButtonText('Create')
        .setCta()
        .onClick(() => {
          void this.submit();
        });
    });
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async submit(): Promise<void> {
    const name = this.languageName.trim();

    if (!name) {
      new Notice('Enter a language name first.');
      return;
    }

    try {
      await this.onCreate(name);
      this.close();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      new Notice(`Could not create language: ${message}`);
    }
  }
}
