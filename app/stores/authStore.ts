import type { Account, LoginResult, Tier } from "~/types/auth";

const LOCK_FALLBACK_SECONDS = 30;

/** The API words a lockout as "Try again in 28s". */
const secondsFrom = (message: string) => {
  const m = /try again in (\d+)\s*s/i.exec(message);
  return m ? Number(m[1]) : LOCK_FALLBACK_SECONDS;
};

/**
 * The customer's session. The API token lives in an httpOnly cookie handled by this app's server
 * (server/api/auth/*); the browser only knows who is signed in. `ensureLoaded` asks the server once
 * at startup (plugins/auth.ts, on the server too), so pages and server-rendered HTML agree.
 */
export const useAuthStore = defineStore("auth", () => {
  const user = ref<Account | null>(null);
  const loaded = ref(false);
  const isSignedIn = computed(() => !!user.value);

  let loading: Promise<void> | null = null;
  const ensureLoaded = () => {
    if (loaded.value) return Promise.resolve();
    loading ??= api<{ user: Account }>("/api/auth/me")
      .then((res) => {
        user.value = res.user;
      })
      .catch(() => {
        user.value = null;
      })
      .finally(() => {
        loaded.value = true;
        loading = null;
      });
    return loading;
  };

  const register = async (input: {
    name: string;
    studio: string;
    email: string;
    tier: Tier;
    newsletter: boolean;
    password: string;
  }): Promise<{ ok: true } | { ok: false; reason: "exists" | "invalid"; message?: string }> => {
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: {
          name: input.name.trim(),
          studio: input.studio.trim(),
          email: input.email.trim(),
          tier: input.tier,
          newsletter: input.newsletter,
          password: input.password,
        },
      });
      return { ok: true };
    } catch (e) {
      if (statusOf(e) === 409) return { ok: false, reason: "exists" };
      return { ok: false, reason: "invalid", message: messageOf(e) };
    }
  };

  const login = async (email: string, password: string, remember: boolean): Promise<LoginResult> => {
    try {
      const res = await api<{ user: Account }>("/api/auth/login", {
        method: "POST",
        body: { email: email.trim(), password, remember },
      });
      user.value = res.user;
      loaded.value = true;
      return { ok: true };
    } catch (e) {
      if (statusOf(e) === 429) return { ok: false, reason: "locked", retryInSeconds: secondsFrom(messageOf(e)) };
      return { ok: false, reason: "invalid" };
    }
  };

  const logout = async () => {
    user.value = null;
    // Orders this browser looked up (and their PINs) belong to the person who signed out.
    useOrderStore().clear();
    clearNuxtData("account-orders");
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      // the cookie is also dropped by the server on the next rejected request
    }
  };

  /** Called when any request comes back 401: the session is gone, so show the signed-out state. */
  const expire = () => {
    user.value = null;
  };

  /** Always succeeds, whether or not the email is registered, so the form can't be used to probe for accounts. */
  const requestReset = async (email: string): Promise<{ token?: string; expires: number }> => {
    try {
      const res = await api<{ expires: number; devToken?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: { email: email.trim() },
      });
      return { token: res.devToken, expires: res.expires };
    } catch {
      // Same answer as success, so nothing is revealed.
      return { expires: Date.now() };
    }
  };

  const tokenState = async (resetToken: string): Promise<{ valid: true; expires: number } | { valid: false }> => {
    if (!resetToken) return { valid: false };
    try {
      const res = await api<{ valid: boolean; expires?: number }>(
        `/api/auth/reset-token/${encodeURIComponent(resetToken)}`,
      );
      return res.valid && res.expires ? { valid: true, expires: res.expires } : { valid: false };
    } catch {
      return { valid: false };
    }
  };

  const resetPassword = async (resetToken: string, password: string): Promise<{ ok: boolean }> => {
    try {
      await api("/api/auth/reset-password", { method: "POST", body: { token: resetToken, password } });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  /** Updates the signed-in account's profile fields. The email is the account's identity, so it isn't editable here. */
  const updateProfile = async (
    patch: Partial<Pick<Account, "name" | "studio" | "title" | "phone" | "newsletter">>,
  ): Promise<{ ok: boolean }> => {
    try {
      const res = await api<{ user: Account }>("/api/auth/profile", { method: "PATCH", body: patch });
      user.value = res.user;
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  /** Changes the password after the server checks the current one. */
  const changePassword = async (
    current: string,
    next: string,
  ): Promise<{ ok: true } | { ok: false; reason: "wrong-password" }> => {
    try {
      await api("/api/auth/change-password", { method: "POST", body: { current, next } });
      return { ok: true };
    } catch {
      return { ok: false, reason: "wrong-password" };
    }
  };

  return {
    user,
    loaded,
    isSignedIn,
    ensureLoaded,
    register,
    login,
    logout,
    expire,
    requestReset,
    tokenState,
    resetPassword,
    updateProfile,
    changePassword,
  };
});
