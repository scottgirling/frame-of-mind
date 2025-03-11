import { generateSlug } from "random-word-slugs";

const comicThemeOptions = {
  format: "title",
  partsOfSpeech: ["noun"],
};

export const comicTheme = generateSlug(1, comicThemeOptions);

function inspireMeAdjectiveGenerator() {
  const inspireMeOptions = {
    format: "title",
    partsOfSpeech: ["adjective"],
  };
  const inspireMeAdjective = generateSlug(1, inspireMeOptions);
  return inspireMeAdjective;
}

function inspireMeNounGenerator() {
  const inspireMeOptions = {
    format: "title",
    partsOfSpeech: ["noun"],
  };
  const inspireMeNoun = generateSlug(1, inspireMeOptions);
  return inspireMeNoun;
}

export function inspireMeGenerator() {
  let inspireMeArray = [];

  const adjective = inspireMeAdjectiveGenerator();
  inspireMeArray.push(adjective);
  const noun = inspireMeNounGenerator();
  inspireMeArray.push(noun);

  const randomResult = Math.floor(Math.random() * inspireMeArray.length);
  return inspireMeArray[randomResult];
}
