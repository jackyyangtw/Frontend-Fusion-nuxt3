// firebase user type

export interface FirebaseUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    phoneNumber: string;
    isAnonymous: boolean;
    tenantId: string;
    providerData: any[];
    apiKey: string;
    appName: string;
    authDomain: string;
    stsTokenManager: {
        apiKey: string;
        refreshToken: string;
        accessToken: string;
        expirationTime: number;
    };
    redirectEventId: string;
    lastLoginAt: string;
    createdAt: string;
    multiFactor: {
        enrolledFactors: any[];
    };
}
