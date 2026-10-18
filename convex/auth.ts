type Identity = {
  subject: string;
  email?: string;
  name?: string;
  pictureUrl?: string;
};

type AuthContext = {
  auth: {
    getUserIdentity: () => Promise<Identity | null>;
  };
};

export const auth = {
  getUserIdentity: (ctx: AuthContext) => ctx.auth.getUserIdentity(),
};
