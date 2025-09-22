import { safeJson } from "./http";
import fixturesFallback from "../fixtures/fixtures.json";

// Usa tu env pública de Expo si ya la tienes configurada
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// ⚠️ Si tu endpoint real es otro (p.ej. "/api/fixtures" o "/matches"), cámbialo aquí:
const FIXTURES_PATH = "/fixtures";

export async function getFixtures() {
  try {
    const res = await fetch(`${BASE_URL}${FIXTURES_PATH}`, {
      headers: { Accept: "application/json" },
    });
    const data = await safeJson(res);
    if (!Array.isArray(data)) throw new Error("Invalid payload");
    return data;
  } catch (err) {
    if (__DEV__) {
      console.warn("getFixtures → usando fixtures locales:", err?.message || err);
    }
    return fixturesFallback;
  }
}
