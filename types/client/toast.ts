export interface Toast {
    showToast: boolean;
    message: string;
    messageType: "loading" | "error" | "success" | "warn" | "info";
}
