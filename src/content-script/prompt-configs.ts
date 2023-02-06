import {
    Icon,
    ProjectRoadmapIcon,
    PaintbrushIcon,
} from '@primer/octicons-react'

export interface PromptSettings {
    buttonLabel: string,
    buttonIcon: Icon,
    title : string,
}

export const promptSettings: Record<string, PromptSettings> = {
    review: {
        buttonLabel : "Review",
        buttonIcon : PaintbrushIcon,
        title : "ChatGPT - Generate Review",
    },
    rebuttal: {
        buttonLabel : "Rebuttal",
        buttonIcon : ProjectRoadmapIcon,
        title : "ChatGPT - Generate Rebuttal",
    },
}
