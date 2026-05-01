export type RootStackParamList = {
  Subject: { subjectId: string };
  Topics: { subjectId: string; chapterId: string; chapterTitle: string };
  Home: undefined;
  Login: undefined;
  SetEmail: undefined;
  AskForEmail: undefined;
  Register: undefined;
  Profile: undefined;
  Settings: undefined;
  Subscription: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
