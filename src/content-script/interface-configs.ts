export interface ElementInterface {
    reviewButtonParent: string,
    rebuttalButtonParent: string,
    resultContainer: string,
    resultContainerChild: string
}

export const config: Record<string, ElementInterface> = {
  notebook: {
    reviewButtonParent: ".reply_row",
    rebuttalButtonParent: ".reply_row",
    resultContainer: '#pager',
    resultContainerChild : "#pager-container",

  },
  lab: {
    reviewButtonParent: ".reply_row",
    rebuttalButtonParent: ".reply_row",
    resultContainer: '#labContainerParent',
    resultContainerChild : "#labContainerChild",
  }
}
