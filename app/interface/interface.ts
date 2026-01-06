export interface IStore {
  createdAt: Date;
  id: string;
  name: string;
  updatedAt: Date;
  userID: string;
}

export interface APIAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}
