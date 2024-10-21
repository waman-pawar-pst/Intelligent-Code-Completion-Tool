// utils/openai.ts

export const getCodeSuggestions = async (
  code: string,
  position: { line: number; character: number }
) => {
  // const response = await fetch("https://api.openai.com/v1/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer `,
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo", // e.g., "text-davinci-003"
  //     prompt: code,
  //     max_tokens: 100,
  //     temperature: 0,
  //     stop: ["\n"],
  //   }),
  // });

  // const data = await response.json();
  return "";
  // return data.choices[0]?.text?.trim() || "";
};
