export function reviewTemplate(
    paperTitle : string,
    paperAbstract : string,
) { return `
/* BACKGROUND INFORMATION */

Title: ${paperTitle}

Abstract: ${paperAbstract}

/* MAIN INSTRUCTIONS */

write a review for the paper, including Paper Summary, Summary Of Strengths, Summary Of Weaknesses, Comments, Suggestions And Typos.
Please organize your review in the following format:
1. Paper Summary: Summarize the paper in 500 words.
2. Summary Of Strengths: Summarize the strengths of the paper by points.
3. Summary Of Weaknesses: Summarize the weaknesses of the paper by points.
4. Comments: Provide comments on the paper and the suggestions for improvement by points.
`
}

export function rebuttalTemplate(
    paperSummary : string,
    paperSummaryOfStrengths : string,
    paperSummaryOfWeaknesses : string,
    paperSuggestions : string,
) { return `
/* BACKGROUND INFORMATION */

Paper Summary:
${paperSummary}

Summary Of Strengths:
${paperSummaryOfStrengths}

Summary Of Weaknesses:
${paperSummaryOfWeaknesses}

Comments, Suggestions And Typos:
${paperSuggestions}

/* MAIN INSTRUCTIONS */

write a rebuttal by points for the review above.
`
}
export const promptTemplates = {
    review : reviewTemplate,
    rebuttal : rebuttalTemplate,
}

