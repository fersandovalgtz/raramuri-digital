export type ParallelSourceRow = {
  recordId: string;
  headword: string;
  classification: string;
  classificationFamily: string;
  translationRaw: string;
  examplesJson: string;
  sourceCode: string;
  sourceDocument: string;
  pageStart: number;
  pageEnd: number;
  status: string;
};

export type AlignmentStatus = "Alineado" | "Revisión requerida";

export type ParallelPair = {
  pairId: string;
  entryId: string;
  headwordRrm: string;
  classification: string;
  classificationFamily: string;
  rrmText: string;
  spaText: string;
  alignmentStatus: AlignmentStatus;
  alignmentType: "1:1" | "1:n" | "n:1" | "sin contraparte";
  confidence: "Alta" | "Media" | "Baja";
  sourceExample: string;
  sourceCode: string;
  sourceDocument: string;
  pageStart: number;
  pageEnd: number;
  sourceStatus: string;
};

const spanishStrong = new Set([
  "abajo", "abuela", "agua", "ahora", "alli", "año", "aqui", "asi", "bien", "caballo", "calabaza", "camino",
  "cara", "casa", "como", "cuando", "dijo", "dice", "donde", "el", "ella", "ellos", "en", "era", "eran", "eres", "es", "esa", "ese",
  "eso", "esta", "estaba", "estan", "estas", "este", "estos", "fue", "fueron", "hace", "hacia", "hay", "hasta", "hombre",
  "la", "las", "le", "les", "lo", "los", "me", "mi", "mis", "mucho", "muy", "niño", "no", "nos", "nuestro", "para",
  "pero", "porque", "puede", "se", "si", "sin", "son", "su", "sus", "tambien", "te", "tengo", "tiene",
  "tienen", "todavia", "un", "una", "uno", "unos", "usted", "ustedes", "va", "vamos", "van", "vease", "voy", "ya",
  "yo",
]);

const rrmStrong = new Set([
  "abiji", "acha", "ayena", "bine", "binoy", "bire", "chabe", "cho", "chona", "echi", "echico", "echona", "gara", "hue",
  "jare", "jena", "jipi", "ju", "jumi", "mapari", "mapu", "mapujiti", "ma", "nije", "nijeni", "niru", "quecha",
  "quetasi", "raramuri", "simiri", "tami", "ucu", "upira",
]);

function normalizeForDetection(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-zñáéíóúü'’]+/giu, " ")
    .trim();
}

function languageScore(value: string, spanishVocabulary: Set<string>) {
  const tokens = normalizeForDetection(value).split(/\s+/u).filter(Boolean);
  let spanish = 0;
  let rrm = 0;
  for (const token of tokens) {
    if (spanishStrong.has(token)) spanish += 2;
    if (rrmStrong.has(token)) rrm += 2;
    if (token.length >= 3 && spanishVocabulary.has(token)) spanish += 1;
    if (/(ando|iendo|ado|ido|aba|ia|aron|ieron|emos|amos)$/u.test(token)) spanish += 1;
  }
  if (/\b(véase|dicen que|es decir|quiere decir)\b/iu.test(value)) spanish += 4;
  return { spanish, rrm };
}

function isSpanish(value: string, spanishVocabulary: Set<string>) {
  const score = languageScore(value, spanishVocabulary);
  return score.spanish > score.rrm && score.spanish > 0;
}

function cleanSegment(value: string) {
  return value
    .replace(/^[\s,;:–—-]+|[\s,;:–—-]+$/gu, "")
    .replace(/\s+([,.!?;:])/gu, "$1")
    .replace(/\s+/gu, " ")
    .trim();
}

function splitSentenceUnits(value: string) {
  const protectedText = value
    .replace(/\[[^\]]*\]/gu, " ")
    .replace(/\b(uds?|pp|pret|fut|imper|ger)\./giu, "$1∯")
    .replace(/\s+/gu, " ")
    .trim();
  return protectedText
    .split(/(?<=[.!?])\s+(?=[¡¿A-ZÁÉÍÓÚÜÑ'0-9])/gu)
    .map((item) => cleanSegment(item.replaceAll("∯", ".")))
    .filter(Boolean);
}

function splitInternalPair(value: string, spanishVocabulary: Set<string>): [string, string] | null {
  const commaIndexes = [...value.matchAll(/[,;:]\s*/gu)].map((match) => match.index ?? -1).filter((index) => index > 0);
  let best: { pair: [string, string]; score: number } | null = null;
  for (const index of commaIndexes) {
    const left = cleanSegment(value.slice(0, index));
    const right = cleanSegment(value.slice(index + 1));
    if (!left || !right) continue;
    const leftScore = languageScore(left, spanishVocabulary);
    const rightScore = languageScore(right, spanishVocabulary);
    if (!isSpanish(left, spanishVocabulary) && isSpanish(right, spanishVocabulary) && rightScore.spanish >= 1) {
      const separation = (leftScore.rrm - leftScore.spanish) + (rightScore.spanish - rightScore.rrm);
      if (!best || separation > best.score) best = { pair: [left, right], score: separation };
    }
  }
  return best?.pair ?? null;
}

function splitInlinePair(value: string, spanishVocabulary: Set<string>): [string, string] | null {
  const words = value.split(/\s+/u);
  if (words.length < 2) return null;
  let best: { pair: [string, string]; score: number } | null = null;
  for (let index = 1; index < words.length; index += 1) {
    const left = cleanSegment(words.slice(0, index).join(" "));
    const right = cleanSegment(words.slice(index).join(" "));
    const leftScore = languageScore(left, spanishVocabulary);
    const rightScore = languageScore(right, spanishVocabulary);
    if (!isSpanish(left, spanishVocabulary) && isSpanish(right, spanishVocabulary) && rightScore.spanish >= 2) {
      const separation = (leftScore.rrm - leftScore.spanish) + (rightScore.spanish - rightScore.rrm);
      if (!best || separation > best.score) best = { pair: [left, right], score: separation };
    }
  }
  return best?.pair ?? null;
}

type Segment = { text: string; language: "rrm" | "spa" };
type DraftPair = { rrmText: string; spaText: string; alignmentType: ParallelPair["alignmentType"]; direct: boolean };

function alignSegmentBlock(segments: Segment[]): DraftPair[] {
  if (!segments.length) return [];
  const output: DraftPair[] = [];
  let cursor = 0;
  while (cursor < segments.length) {
    if (segments[cursor].language === "spa") {
      output.push({ rrmText: "", spaText: segments[cursor].text, alignmentType: "sin contraparte", direct: false });
      cursor += 1;
      continue;
    }
    const rrm: string[] = [];
    while (cursor < segments.length && segments[cursor].language === "rrm") {
      rrm.push(segments[cursor].text);
      cursor += 1;
    }
    const spa: string[] = [];
    while (cursor < segments.length && segments[cursor].language === "spa") {
      spa.push(segments[cursor].text);
      cursor += 1;
    }
    if (!spa.length) {
      output.push({ rrmText: rrm.join(" "), spaText: "", alignmentType: "sin contraparte", direct: false });
    } else if (rrm.length === spa.length) {
      rrm.forEach((text, index) => output.push({ rrmText: text, spaText: spa[index], alignmentType: "1:1", direct: false }));
    } else if (rrm.length === 1) {
      output.push({ rrmText: rrm[0], spaText: spa.join(" "), alignmentType: "1:n", direct: false });
    } else if (spa.length === 1) {
      output.push({ rrmText: rrm.join(" "), spaText: spa[0], alignmentType: "n:1", direct: false });
    } else {
      const paired = Math.min(rrm.length, spa.length);
      for (let index = 0; index < paired; index += 1) {
        output.push({ rrmText: rrm[index], spaText: spa[index], alignmentType: "1:1", direct: false });
      }
      if (rrm.length > paired) output.push({ rrmText: rrm.slice(paired).join(" "), spaText: "", alignmentType: "sin contraparte", direct: false });
      if (spa.length > paired) output.push({ rrmText: "", spaText: spa.slice(paired).join(" "), alignmentType: "sin contraparte", direct: false });
    }
  }
  return output;
}

function alignExample(value: string, spanishVocabulary: Set<string>) {
  const output: DraftPair[] = [];
  let pending: Segment[] = [];
  const flush = () => {
    output.push(...alignSegmentBlock(pending));
    pending = [];
  };
  for (const unit of splitSentenceUnits(value)) {
    const punctuatedPair = splitInternalPair(unit, spanishVocabulary);
    const inlinePair = punctuatedPair ? null : splitInlinePair(unit, spanishVocabulary);
    const direct = punctuatedPair ?? inlinePair;
    if (direct) {
      flush();
      output.push({ rrmText: direct[0], spaText: direct[1], alignmentType: "1:1", direct: Boolean(punctuatedPair) });
    } else {
      pending.push({ text: unit, language: isSpanish(unit, spanishVocabulary) ? "spa" : "rrm" });
    }
  }
  flush();
  return output.filter((pair) => pair.rrmText || pair.spaText);
}

function parseExamples(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function deriveParallelPairs(rows: ParallelSourceRow[]) {
  const pairs: ParallelPair[] = [];
  const spanishVocabulary = new Set(
    rows.flatMap((row) => normalizeForDetection(row.translationRaw).split(/\s+/u)).filter((token) => token.length >= 3),
  );
  for (const row of rows) {
    const examples = parseExamples(row.examplesJson);
    examples.forEach((sourceExample, exampleIndex) => {
      alignExample(sourceExample, spanishVocabulary).forEach((draft, pairIndex) => {
        const complete = Boolean(draft.rrmText && draft.spaText);
        const oneToOne = draft.alignmentType === "1:1";
        pairs.push({
          pairId: `PAR-${row.recordId.slice(3)}-${String(exampleIndex + 1).padStart(2, "0")}-${String(pairIndex + 1).padStart(2, "0")}`,
          entryId: row.recordId,
          headwordRrm: row.headword,
          classification: row.classification,
          classificationFamily: row.classificationFamily,
          rrmText: draft.rrmText,
          spaText: draft.spaText,
          alignmentStatus: complete ? "Alineado" : "Revisión requerida",
          alignmentType: draft.alignmentType,
          confidence: !complete ? "Baja" : oneToOne && draft.direct ? "Alta" : oneToOne ? "Media" : "Baja",
          sourceExample,
          sourceCode: row.sourceCode,
          sourceDocument: row.sourceDocument,
          pageStart: row.pageStart,
          pageEnd: row.pageEnd,
          sourceStatus: row.status,
        });
      });
    });
  }
  return pairs;
}
