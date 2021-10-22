interface UserDocument {
  ID: number;
  NameForView: string;
  NameForLocate: string;
  Password: string;
  AvatarPath: string | undefined;
  Gender: number;
  Introduction: string;
  CreatedTime: Date;
}
