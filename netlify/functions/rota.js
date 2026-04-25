import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const store = getStore("rota");

  if (req.method === "GET") {
    try {
      const data = await store.get("main", { type: "json" });
      return new Response(JSON.stringify(data || {}), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({}), { status: 200, headers });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON("main", body);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: e.message }),
        { status: 500, headers }
      );
    }
  }

  return new Response("Method not allowed", { status: 405, headers });
};

export const config = { path: "/api/rota" };
