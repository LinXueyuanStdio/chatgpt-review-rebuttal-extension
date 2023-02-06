import { promptTemplates } from './promptTemplates.js'

export function buildReviewQuery(siteName: string, paperContainerElement: Element): string {
    const type = "review"
    let paperTitle: string = ""
    let paperAbstract: string = ""
    const titleNode = paperContainerElement.querySelector(".title_pdf_row > .note_content_title")
    paperTitle = titleNode?.textContent ?? ""

    if (siteName === "notebook") {
        const node_contents = paperContainerElement.querySelectorAll(".note_contents") ?? []
        for (const node of node_contents) {
            const node_title = node.querySelector(".note_content_field")
            if (!node_title) continue
            const text = node_title.textContent?.toLowerCase()
            if (!text) continue
            if (text.includes("abstract")) {
                const abstract = node.querySelector(".note_content_value")
                paperAbstract = abstract?.textContent ?? ""
            }
        }
    } else {
        return ""
    }
    const query = promptTemplates[type](paperTitle, paperAbstract)
    return query
}

export function queryReviewElements(siteName: string) {
    if (siteName === "notebook") {
        const reviewsContainerElement = document.querySelector("#note_children")
        const reviewElements = reviewsContainerElement?.querySelectorAll(".note_with_children .note") ?? []
        return reviewElements
    }
    return []
}

const fuzzyKeys: Record<string, string[]> = {
    summary: ["summary"],
    strengths: ["strengths", "strength"],
    weaknesses: ["weaknesses", "weakness"],
    suggestions: ["suggestions", "suggestion", "comments", "comment"]
}

export function buildRebuttalQuery(siteName: string, reviewContainerElement: Element): string {
    const type = "rebuttal"
    let paperSummary : string = ""
    let paperSummaryOfStrengths : string = ""
    let paperSummaryOfWeaknesses : string = ""
    let paperSuggestions : string = ""

    if (siteName === "notebook") {
        const node_contents = reviewContainerElement.querySelectorAll(".note_contents") ?? []
        for (const node of node_contents) {
            const node_title = node.querySelector(".note_content_field")
            if (!node_title) continue
            const text = node_title.textContent?.toLowerCase()
            if (!text) continue
            const content = node.querySelector(".note_content_value")
            if (!content) continue
            for (const key in fuzzyKeys) {
                if (fuzzyKeys[key].some((k) => text.includes(k))) {
                    const contentText = content?.textContent ?? ""
                    if (key === "summary") {
                        paperSummary = contentText
                    } else if (key === "strengths") {
                        paperSummaryOfStrengths = contentText
                    } else if (key === "weaknesses") {
                        paperSummaryOfWeaknesses = contentText
                    } else if (key === "suggestions") {
                        paperSuggestions = contentText
                    }
                }
            }
        }
    } else {
        return ""
    }
    const query = promptTemplates[type](paperSummary, paperSummaryOfStrengths, paperSummaryOfWeaknesses, paperSuggestions)
    return query
}
