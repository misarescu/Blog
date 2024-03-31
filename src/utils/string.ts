export function trimByWordCount(content: string[], count: number): string[] {
  return content.map((c) => {
    let words = c.split(" ");
    if (words.length > count) {
      words = words.slice(0, count);
    }
    let result = words.join(" ");
    return result;
  });
}
