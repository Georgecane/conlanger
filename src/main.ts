import { Notice, Plugin, TFolder } from 'obsidian';
import { CreateLanguageModal } from './language-creation-modal';
import { buildLanguageNote, slugifyLanguageName } from './language-model';

export default class ConlangerPlugin extends Plugin {
  onload(): void {
    this.addCommand({
      id: 'create-language',
      name: 'Create language',
      callback: () => {
        new CreateLanguageModal(this.app, (name) => this.createLanguage(name)).open();
      }
    });
  }

  private async createLanguage(name: string): Promise<void> {
    const rootPath = 'Conlanger';
    const rootEntry = this.app.vault.getAbstractFileByPath(rootPath);

    if (rootEntry && !(rootEntry instanceof TFolder)) {
      throw new Error('A file named "Conlanger" already exists in the vault.');
    }

    if (!rootEntry) {
      await this.app.vault.createFolder(rootPath);
    }

    const baseId = slugifyLanguageName(name);
    let languageId = baseId;
    let folderPath = `${rootPath}/${languageId}`;
    let suffix = 2;

    while (this.app.vault.getAbstractFileByPath(folderPath)) {
      languageId = `${baseId}-${suffix}`;
      folderPath = `${rootPath}/${languageId}`;
      suffix += 1;
    }

    await this.app.vault.createFolder(folderPath);

    const createdAt = new Date().toISOString();
    const notePath = `${folderPath}/Language.md`;
    const content = buildLanguageNote(name, languageId, createdAt);

    const file = await this.app.vault.create(notePath, content);
    await this.app.workspace.getLeaf(false).openFile(file);
    new Notice(`Created language: ${name}`);
  }
}
