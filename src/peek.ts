import {
  App,
  Component,
  EventRef,
  MarkdownRenderer,
  Modal,
  TFile,
} from 'obsidian';
import { isImagePath } from './media';

/** Read-only quick look at a note, shown over the feed. */
export class PeekModal extends Modal {
  private readonly renderComponent = new Component();
  private fileOpenRef: EventRef | null = null;

  constructor(
    app: App,
    private readonly file: TFile,
    private readonly openInTab: () => void
  ) {
    super(app);
  }

  async onOpen(): Promise<void> {
    this.modalEl.addClass('doomscroll-peek');
    this.setTitle(this.file.basename);
    this.renderComponent.load();

    // Space toggles the peek, like Quick Look; Enter promotes it to a tab.
    this.scope.register([], ' ', () => {
      this.close();
      return false;
    });
    this.scope.register([], 'Enter', () => {
      this.close();
      this.openInTab();
      return false;
    });

    // Anything that opens a note behind the modal (e.g. a link inside an
    // embedded base) should dismiss the peek so the note is actually visible.
    this.fileOpenRef = this.app.workspace.on('file-open', () => this.close());

    const body = this.contentEl.createDiv('doomscroll-peek-body');
    body.addEventListener('click', (event) => this.handleLinkClick(event));
    if (isImagePath(this.file.path)) {
      body
        .createEl('img', { cls: 'doomscroll-peek-image' })
        .setAttribute('src', this.app.vault.getResourcePath(this.file));
    } else {
      body.addClass('markdown-rendered');
      const markdown = await this.app.vault.cachedRead(this.file);
      await MarkdownRenderer.render(
        this.app,
        markdown,
        body,
        this.file.path,
        this.renderComponent
      );
    }

    const footer = this.contentEl.createDiv('doomscroll-peek-footer');
    footer
      .createEl('button', { text: 'Open in tab', cls: 'mod-cta' })
      .addEventListener('click', () => {
        this.close();
        this.openInTab();
      });
  }

  /** Rendered links are inert inside a modal, so open them ourselves. */
  private handleLinkClick(event: MouseEvent): void {
    const link = (event.target as HTMLElement).closest('a');
    if (!link) return;

    if (link.hasClass('internal-link')) {
      const target = link.getAttribute('data-href') ?? link.getAttribute('href');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      void this.app.workspace.openLinkText(target, this.file.path, 'tab');
    } else if (link.hasClass('external-link')) {
      const href = link.getAttribute('href');
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      window.open(href);
    }
  }

  onClose(): void {
    if (this.fileOpenRef) {
      this.app.workspace.offref(this.fileOpenRef);
      this.fileOpenRef = null;
    }
    this.renderComponent.unload();
    this.contentEl.empty();
  }
}
