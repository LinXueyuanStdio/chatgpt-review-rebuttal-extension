export interface ElementInterface {
    reviewButtonParent: string,
    rebuttalButtonParent: string,
    resultContainer: string,
    loadingElement: string,
    titleElement: string,
    abstractElement: string,
}

export const config: Record<string, ElementInterface> = {
  notebook: {
    reviewButtonParent: ".reply_row",
    rebuttalButtonParent: ".reply_row",
    resultContainer: '#content > .forum-container > .note',
    loadingElement: "#note_children > .spinner-container",
    titleElement: "#content > .forum-container > .note > .title_pdf_row > .note_content_title",
    abstractElement: "#content > .forum-container > .note > .note_contents",
  },
  icml2023: {
    reviewButtonParent: ".invitations-container > .invitation-buttons",
    rebuttalButtonParent: ".invitations-container > .invitation-buttons",
    resultContainer: '#content > .forum-container > .forum-replies-container',
    loadingElement: "#forum-replies > .spinner",
    titleElement: "#content > div > div.forum-note > div.forum-title.mt-2.mb-2 > h2",
    abstractElement: "#content > div > div.forum-note > div.note-content",
  },
}
