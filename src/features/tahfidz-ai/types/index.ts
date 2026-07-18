export interface Ayah {
  text: string;
  surahName: string;
  numberInSurah: number;
  normalizedText: string;
}

export interface DetectedAyahState {
  primary: Ayah;
  others: Ayah[];
}

export interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface AlQuranCloudAyah {
  text: string;
  numberInSurah: number;
}

export interface AlQuranCloudSurah {
  englishName: string;
  ayahs: AlQuranCloudAyah[];
}

export interface AlQuranCloudResponse {
  data: {
    surahs: AlQuranCloudSurah[];
  };
}

export interface ISpeechRecognitionEvent {
  results: ArrayLike<{ 0: { transcript: string } }>;
}

export interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}
