import { Notice, Plugin } from 'obsidian';

export default class ConlangerPlugin extends Plugin {
  onload(): void {
    this.addCommand({
      id: 'show-status',
      name: 'Show development status',
      callback: () => {
        new Notice('Conlanger is installed and running.');
      }
    });
  }
}
