export interface Parent {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  preferences: NamePreference;
}

export interface NamePreference {
  style: string[];
  dislikedNames: string[];
}
